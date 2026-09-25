import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Subject from '../models/Subject.js';
import Assignment from '../models/Assignment.js';
import Exam from '../models/Exam.js';
import DailyActivity from '../models/DailyActivity.js';
import { getStudentAttendanceSummary } from '../controllers/attendanceController.js';
import { getTodayDateString } from './gamificationService.js';

/**
 * Synchronizes smart reminders based on actual user data and preferences
 */
export const syncAndGetNotifications = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const prefs = user.notificationPreferences || {
    attendanceWarnings: true,
    assignmentReminders: true,
    examReminders: true,
    plannerReminders: true,
    dailyBrainBoost: true
  };

  const now = new Date();
  const todayStr = getTodayDateString();

  // 1. Attendance Reminders & Warnings
  if (prefs.attendanceWarnings !== false) {
    try {
      const summary = await getStudentAttendanceSummary(userId);
      for (const item of summary.subjects || []) {
        if (item.currentPercent < item.minPercent) {
          const key = `att_crit_${item.subject._id}_${item.currentPercent}`;
          const existing = await Notification.findOne({
            userId,
            'metadata.key': key
          });
          if (!existing) {
            await Notification.create({
              userId,
              title: `Attendance Warning: ${item.subject.name}`,
              message: `${item.subject.name} is at ${item.currentPercent}%, below required ${item.minPercent}%. Attend next ${item.recoveryNeeded} classes to recover.`,
              type: 'attendance',
              severity: 'critical',
              link: '/attendance',
              metadata: { key, subjectId: item.subject._id }
            });
          }
        } else if (item.safeAbsenceBuffer <= 1 && item.currentPercent >= item.minPercent && item.conductedClasses > 0) {
          const key = `att_buf_${item.subject._id}_${item.safeAbsenceBuffer}`;
          const existing = await Notification.findOne({
            userId,
            'metadata.key': key
          });
          if (!existing) {
            await Notification.create({
              userId,
              title: `Low Absence Buffer: ${item.subject.name}`,
              message: `Safe buffer is down to ${item.safeAbsenceBuffer} class${item.safeAbsenceBuffer === 1 ? '' : 'es'}. Avoid unexcused absences.`,
              type: 'attendance',
              severity: 'warning',
              link: '/attendance',
              metadata: { key, subjectId: item.subject._id }
            });
          }
        }
      }
    } catch (err) {
      console.error('[NotificationService] Attendance sync error:', err.message);
    }
  }

  // 2. Assignment Due Date Reminders (due within 48h)
  if (prefs.assignmentReminders !== false) {
    try {
      const in48h = new Date(Date.now() + 48 * 60 * 60 * 1000);
      const urgentAssignments = await Assignment.find({
        userId,
        status: { $in: ['pending', 'late'] },
        dueDate: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000), $lte: in48h }
      }).populate('subjectId', 'name');

      for (const asg of urgentAssignments) {
        const key = `asg_due_${asg._id}`;
        const existing = await Notification.findOne({
          userId,
          'metadata.key': key
        });
        if (!existing) {
          const subjectName = asg.subjectId?.name || 'Coursework';
          await Notification.create({
            userId,
            title: `Assignment Due: ${asg.title}`,
            message: `${subjectName} assignment is due on ${new Date(asg.dueDate).toLocaleDateString()}. Submit on time to earn +15 XP.`,
            type: 'assignment',
            severity: 'warning',
            link: '/assignments',
            metadata: { key, assignmentId: asg._id }
          });
        }
      }
    } catch (err) {
      console.error('[NotificationService] Assignment sync error:', err.message);
    }
  }

  // 3. Upcoming Exam Reminders (next 7 days)
  if (prefs.examReminders !== false) {
    try {
      const in7d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      const upcomingExams = await Exam.find({
        userId,
        isCompleted: false,
        date: { $gte: now, $lte: in7d }
      }).populate('subjectId', 'name');

      for (const exam of upcomingExams) {
        const key = `exam_soon_${exam._id}`;
        const existing = await Notification.findOne({
          userId,
          'metadata.key': key
        });
        if (!existing) {
          const subjectName = exam.subjectId?.name || 'Subject';
          const diffDays = Math.ceil((new Date(exam.date) - now) / (1000 * 60 * 60 * 24));
          await Notification.create({
            userId,
            title: `Exam in ${diffDays} day${diffDays === 1 ? '' : 's'}: ${subjectName}`,
            message: `${exam.examType.toUpperCase()} scheduled on ${new Date(exam.date).toLocaleDateString()}${exam.venue ? ` at ${exam.venue}` : ''}. Review syllabus early.`,
            type: 'exam',
            severity: 'info',
            link: '/exams',
            metadata: { key, examId: exam._id }
          });
        }
      }
    } catch (err) {
      console.error('[NotificationService] Exam sync error:', err.message);
    }
  }

  // 4. Daily Brain Boost Reminder
  if (prefs.dailyBrainBoost !== false) {
    try {
      const todayActivity = await DailyActivity.findOne({ userId, date: todayStr });
      if (!todayActivity || !todayActivity.brainBoostCompleted) {
        const key = `brain_boost_${todayStr}`;
        const existing = await Notification.findOne({
          userId,
          'metadata.key': key
        });
        if (!existing) {
          await Notification.create({
            userId,
            title: `Daily Brain Boost Ready!`,
            message: `Sharpen your problem-solving skills today and claim +10 XP to preserve your streak.`,
            type: 'brain_boost',
            severity: 'info',
            link: '/dashboard',
            metadata: { key }
          });
        }
      }
    } catch (err) {
      console.error('[NotificationService] Brain Boost sync error:', err.message);
    }
  }

  // Fetch all notifications for user
  const notifications = await Notification.find({ userId })
    .sort({ isRead: 1, createdAt: -1 })
    .limit(30);

  const unreadCount = await Notification.countDocuments({ userId, isRead: false });

  return {
    notifications,
    unreadCount
  };
};

export const markAsRead = async (userId, notificationId) => {
  const notif = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  );
  if (!notif) throw new Error('Notification not found');
  const unreadCount = await Notification.countDocuments({ userId, isRead: false });
  return { notification: notif, unreadCount };
};

export const markAllAsRead = async (userId) => {
  await Notification.updateMany({ userId, isRead: false }, { isRead: true });
  return { success: true, unreadCount: 0 };
};

export const dismissNotification = async (userId, notificationId) => {
  await Notification.findOneAndDelete({ _id: notificationId, userId });
  const unreadCount = await Notification.countDocuments({ userId, isRead: false });
  return { success: true, unreadCount };
};

export default {
  syncAndGetNotifications,
  markAsRead,
  markAllAsRead,
  dismissNotification
};
