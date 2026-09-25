import Subject from '../models/Subject.js';
import Attendance from '../models/Attendance.js';
import Assignment from '../models/Assignment.js';
import Exam from '../models/Exam.js';
import Mark from '../models/Mark.js';
import { calculateSubjectMetrics } from './attendanceEngine.js';

/**
 * Generate Smart Prioritized Academic Action Plan for student
 *
 * Hierarchy:
 * 1. Attendance shortage
 * 2. Upcoming exam (next 7 days)
 * 3. Overdue assignment
 * 4. Assignment due soon (next 3 days)
 * 5. Weak academic performance
 * 6. High priority subject focus
 */
export const generateAcademicPlan = async (userId) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 1. Fetch all active subjects
  const subjects = await Subject.find({ userId, isActive: true });
  const subjectMap = new Map();
  for (const s of subjects) {
    subjectMap.set(s._id.toString(), s);
  }

  const actionItems = [];

  // --- CHECK 1: ATTENDANCE SHORTAGES ---
  if (subjects.length > 0) {
    const attendanceStats = await Attendance.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$subjectId',
          conducted: {
            $sum: { $cond: [{ $in: ['$status', ['present', 'absent', 'late']] }, 1, 0] }
          },
          attended: {
            $sum: { $cond: [{ $in: ['$status', ['present', 'late']] }, 1, 0] }
          }
        }
      }
    ]);

    const statsMap = new Map();
    for (const stat of attendanceStats) {
      statsMap.set(stat._id.toString(), stat);
    }

    for (const subject of subjects) {
      const stat = statsMap.get(subject._id.toString()) || { conducted: 0, attended: 0 };
      const metrics = calculateSubjectMetrics({
        conducted: stat.conducted,
        attended: stat.attended,
        minPercent: subject.minAttendancePercent,
        priority: subject.priority,
        subjectName: subject.name
      });

      if (stat.conducted > 0 && metrics.currentPercent < metrics.minPercent) {
        actionItems.push({
          id: `att-${subject._id}`,
          category: 'attendance',
          priority: 'critical',
          priorityRank: 1,
          subject: subject.name,
          subjectId: subject._id,
          title: `Attend next ${metrics.recoveryNeeded} classes for ${subject.name}`,
          reason: `Prioritized because ${subject.name} attendance (${metrics.currentPercent}%) is below the required ${metrics.minPercent}%. You need ${metrics.recoveryNeeded} consecutive attendances to recover.`,
          actionUrl: '/attendance'
        });
      } else if (stat.conducted > 0 && metrics.safeAbsenceBuffer === 0 && metrics.currentPercent >= metrics.minPercent) {
        actionItems.push({
          id: `att-buffer-${subject._id}`,
          category: 'attendance',
          priority: 'high',
          priorityRank: 2,
          subject: subject.name,
          subjectId: subject._id,
          title: `Zero attendance buffer in ${subject.name}`,
          reason: `Attendance is right on the line (${metrics.currentPercent}% vs ${metrics.minPercent}% minimum). Missing 1 class will drop you into critical shortage.`,
          actionUrl: '/attendance'
        });
      }
    }
  }

  // --- CHECK 2: UPCOMING EXAMS (next 7 days) ---
  const sevenDaysAhead = new Date(todayStart.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingExams = await Exam.find({
    userId,
    date: { $gte: todayStart, $lte: sevenDaysAhead },
    isCompleted: false
  })
    .populate('subjectId', 'name code')
    .sort({ date: 1 });

  for (const exam of upcomingExams) {
    const examDate = new Date(exam.date);
    const diffTime = examDate.getTime() - todayStart.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const subName = exam.subjectId?.name || 'Subject';

    const isUrgent = daysLeft <= 2;
    actionItems.push({
      id: `exam-${exam._id}`,
      category: 'exam',
      priority: isUrgent ? 'critical' : 'high',
      priorityRank: isUrgent ? 1.5 : 2.5,
      subject: subName,
      subjectId: exam.subjectId?._id,
      dueDate: examDate.toISOString(),
      title: `Prepare for ${subName} ${exam.examType.toUpperCase()}`,
      reason: `Prioritized because an upcoming ${exam.examType} exam in ${subName} is scheduled in ${daysLeft === 0 ? 'today' : daysLeft === 1 ? '1 day' : `${daysLeft} days`}${exam.venue ? ` at ${exam.venue}` : ''}.`,
      actionUrl: '/exams'
    });
  }

  // --- CHECK 3 & 4: OVERDUE & UPCOMING ASSIGNMENTS ---
  const pendingAssignments = await Assignment.find({
    userId,
    status: 'pending'
  })
    .populate('subjectId', 'name code')
    .sort({ dueDate: 1 });

  for (const assignment of pendingAssignments) {
    const dueDate = new Date(assignment.dueDate);
    const subName = assignment.subjectId?.name || 'Subject';

    if (dueDate < todayStart) {
      // Overdue
      actionItems.push({
        id: `asg-overdue-${assignment._id}`,
        category: 'assignment',
        priority: 'high',
        priorityRank: 3,
        subject: subName,
        subjectId: assignment.subjectId?._id,
        dueDate: dueDate.toISOString(),
        title: `Submit overdue assignment: "${assignment.title}"`,
        reason: `Prioritized because assignment "${assignment.title}" for ${subName} was due on ${dueDate.toLocaleDateString()}. Submit as soon as possible.`,
        actionUrl: '/assignments'
      });
    } else {
      const diffTime = dueDate.getTime() - todayStart.getTime();
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (daysLeft <= 3) {
        actionItems.push({
          id: `asg-soon-${assignment._id}`,
          category: 'assignment',
          priority: daysLeft <= 1 ? 'high' : 'medium',
          priorityRank: daysLeft <= 1 ? 3.5 : 4,
          subject: subName,
          subjectId: assignment.subjectId?._id,
          dueDate: dueDate.toISOString(),
          title: `Complete assignment: "${assignment.title}"`,
          reason: `Prioritized because assignment "${assignment.title}" is due in ${daysLeft === 0 ? 'today' : daysLeft === 1 ? 'tomorrow' : `${daysLeft} days`}.`,
          actionUrl: '/assignments'
        });
      }
    }
  }

  // --- CHECK 5: WEAK ACADEMIC PERFORMANCE ---
  const weakMarks = await Mark.find({
    userId,
    percentage: { $lt: 60 }
  })
    .populate('subjectId', 'name code')
    .limit(3);

  for (const mark of weakMarks) {
    const subName = mark.subjectId?.name || 'Subject';
    actionItems.push({
      id: `mark-${mark._id}`,
      category: 'performance',
      priority: 'medium',
      priorityRank: 5,
      subject: subName,
      subjectId: mark.subjectId?._id,
      title: `Revise concepts for ${subName}`,
      reason: `Prioritized because your recent assessment scored ${mark.percentage}% (${mark.marksObtained}/${mark.totalMarks}, Grade: ${mark.grade || 'Below Average'}). Reviewing key chapters will stabilize your GPA.`,
      actionUrl: '/performance'
    });
  }

  // --- CHECK 6: HIGH PRIORITY SUBJECT STUDY ACTION ---
  const highPrioritySubjects = subjects.filter((s) => s.priority === 'high');
  for (const hp of highPrioritySubjects) {
    // Only add if not already having an urgent item
    const existing = actionItems.find((a) => a.subjectId?.toString() === hp._id.toString());
    if (!existing) {
      actionItems.push({
        id: `study-hp-${hp._id}`,
        category: 'study',
        priority: 'low',
        priorityRank: 6,
        subject: hp.name,
        subjectId: hp._id,
        title: `Study session for ${hp.name}`,
        reason: `Student planning preference: You designated ${hp.name} as a High Priority subject. Regular weekly revision recommended.`,
        actionUrl: '/timetable'
      });
    }
  }

  // Sort items by priorityRank asc
  actionItems.sort((a, b) => a.priorityRank - b.priorityRank);

  return actionItems;
};
