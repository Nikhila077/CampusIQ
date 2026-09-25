import Attendance from '../models/Attendance.js';
import Subject from '../models/Subject.js';
import {
  calculateSubjectMetrics,
  simulateScenario,
  calculateOverallAttendance
} from '../services/attendanceEngine.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * Helper: Aggregate attendance logs per subject for a user
 */
const getSubjectStatsMap = async (userId) => {
  const records = await Attendance.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: '$subjectId',
        totalRecords: { $sum: 1 },
        conducted: {
          $sum: {
            $cond: [{ $in: ['$status', ['present', 'absent', 'late']] }, 1, 0]
          }
        },
        attended: {
          $sum: {
            $cond: [{ $in: ['$status', ['present', 'late']] }, 1, 0]
          }
        },
        absent: {
          $sum: {
            $cond: [{ $eq: ['$status', 'absent'] }, 1, 0]
          }
        },
        cancelled: {
          $sum: {
            $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0]
          }
        }
      }
    }
  ]);

  const map = new Map();
  for (const r of records) {
    map.set(r._id.toString(), r);
  }
  return map;
};

/**
 * @desc    Get all attendance logs for student
 * @route   GET /api/attendance
 * @access  Private
 */
export const getAllAttendance = async (req, res, next) => {
  try {
    const { subjectId, limit = 100 } = req.query;
    const filter = { userId: req.user._id };

    if (subjectId) {
      filter.subjectId = subjectId;
    }

    const records = await Attendance.find(filter)
      .populate('subjectId', 'name code priority minAttendancePercent')
      .sort({ date: -1, createdAt: -1 })
      .limit(Number(limit));

    return sendSuccess(res, 200, 'Attendance records fetched.', { records });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get attendance logs for specific subject
 * @route   GET /api/attendance/subject/:subjectId
 * @access  Private
 */
export const getSubjectAttendance = async (req, res, next) => {
  try {
    const { subjectId } = req.params;

    const subject = await Subject.findOne({ _id: subjectId, userId: req.user._id });
    if (!subject) {
      return sendError(res, 404, 'Subject not found.');
    }

    const records = await Attendance.find({
      userId: req.user._id,
      subjectId
    }).sort({ date: -1, createdAt: -1 });

    let conducted = 0;
    let attended = 0;
    let absent = 0;
    let cancelled = 0;

    for (const r of records) {
      if (r.status === 'present' || r.status === 'late') {
        conducted++;
        attended++;
      } else if (r.status === 'absent') {
        conducted++;
        absent++;
      } else if (r.status === 'cancelled') {
        cancelled++;
      }
    }

    const metrics = calculateSubjectMetrics({
      conducted,
      attended,
      minPercent: subject.minAttendancePercent,
      priority: subject.priority,
      subjectName: subject.name
    });

    return sendSuccess(res, 200, 'Subject attendance records and metrics fetched.', {
      subject,
      metrics: {
        ...metrics,
        absent,
        cancelled
      },
      records
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log a new attendance record
 * @route   POST /api/attendance
 * @access  Private
 */
export const logAttendance = async (req, res, next) => {
  try {
    const { subjectId, date, status, classNumber, remarks } = req.body;

    if (!subjectId || !date || !status) {
      return sendError(res, 400, 'Subject, date, and status are required fields.');
    }

    const validStatuses = ['present', 'absent', 'cancelled', 'late'];
    if (!validStatuses.includes(status)) {
      return sendError(res, 400, `Status must be one of: ${validStatuses.join(', ')}`);
    }

    const subject = await Subject.findOne({ _id: subjectId, userId: req.user._id });
    if (!subject) {
      return sendError(res, 404, 'Subject not found.');
    }

    const record = await Attendance.create({
      userId: req.user._id,
      subjectId,
      date: new Date(date),
      status,
      classNumber: classNumber ? Number(classNumber) : 1,
      remarks: remarks ? remarks.trim() : ''
    });

    return sendSuccess(res, 201, 'Attendance record logged successfully.', { record });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an attendance record
 * @route   PUT /api/attendance/:id
 * @access  Private
 */
export const updateAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, status, classNumber, remarks } = req.body;

    const record = await Attendance.findOne({ _id: id, userId: req.user._id });
    if (!record) {
      return sendError(res, 404, 'Attendance record not found or permission denied.');
    }

    if (status !== undefined) {
      const validStatuses = ['present', 'absent', 'cancelled', 'late'];
      if (!validStatuses.includes(status)) {
        return sendError(res, 400, `Invalid status. Choose from: ${validStatuses.join(', ')}`);
      }
      record.status = status;
    }

    if (date !== undefined) record.date = new Date(date);
    if (classNumber !== undefined) record.classNumber = Number(classNumber);
    if (remarks !== undefined) record.remarks = remarks.trim();

    await record.save();
    return sendSuccess(res, 200, 'Attendance record updated.', { record });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an attendance record
 * @route   DELETE /api/attendance/:id
 * @access  Private
 */
export const deleteAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;

    const record = await Attendance.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!record) {
      return sendError(res, 404, 'Attendance record not found.');
    }

    return sendSuccess(res, 200, 'Attendance record deleted.');
  } catch (error) {
    next(error);
  }
};

/**
 * Standalone helper: Get complete attendance summary for a given userId
 */
export const getStudentAttendanceSummary = async (userId) => {
  const subjects = await Subject.find({ userId, isActive: true }).sort({
    priority: 1,
    name: 1
  });

  if (subjects.length === 0) {
    return {
      subjects: [],
      overall: {
        totalSubjects: 0,
        totalConducted: 0,
        totalAttended: 0,
        overallPercent: 100,
        overallStatus: 'Safe',
        safeCount: 0,
        atRiskCount: 0,
        criticalCount: 0
      }
    };
  }

  const statsMap = await getSubjectStatsMap(userId);

  const subjectSummaries = subjects.map((subject) => {
    const stats = statsMap.get(subject._id.toString()) || {
      conducted: 0,
      attended: 0,
      absent: 0,
      cancelled: 0
    };

    const metrics = calculateSubjectMetrics({
      conducted: stats.conducted,
      attended: stats.attended,
      minPercent: subject.minAttendancePercent,
      priority: subject.priority,
      subjectName: subject.name
    });

    return {
      subject: {
        _id: subject._id,
        name: subject.name,
        code: subject.code,
        faculty: subject.faculty,
        priority: subject.priority,
        minAttendancePercent: subject.minAttendancePercent,
        credits: subject.credits,
        semester: subject.semester
      },
      ...metrics,
      conductedClasses: stats.conducted,
      attendedClasses: stats.attended,
      absentClasses: stats.absent,
      cancelledClasses: stats.cancelled
    };
  });

  const overall = calculateOverallAttendance(subjectSummaries);

  return {
    subjects: subjectSummaries,
    overall
  };
};

/**
 * @desc    Get complete attendance summary with Smart Engine calculations for all subjects
 * @route   GET /api/attendance/summary
 * @access  Private
 */
export const getAttendanceSummary = async (req, res, next) => {
  try {
    const summary = await getStudentAttendanceSummary(req.user._id);
    return sendSuccess(res, 200, 'Attendance summary calculated.', summary);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get actionable attendance insights across all subjects
 * @route   GET /api/attendance/insights
 * @access  Private
 */
export const getAttendanceInsights = async (req, res, next) => {
  try {
    const subjects = await Subject.find({ userId: req.user._id, isActive: true });
    const statsMap = await getSubjectStatsMap(req.user._id);

    const allInsights = [];
    const criticalSubjects = [];
    const atRiskSubjects = [];
    const safeSubjects = [];

    for (const subject of subjects) {
      const stats = statsMap.get(subject._id.toString()) || { conducted: 0, attended: 0 };
      const metrics = calculateSubjectMetrics({
        conducted: stats.conducted,
        attended: stats.attended,
        minPercent: subject.minAttendancePercent,
        priority: subject.priority,
        subjectName: subject.name
      });

      const subjectData = {
        subjectId: subject._id,
        name: subject.name,
        code: subject.code,
        currentPercent: metrics.currentPercent,
        minPercent: metrics.minPercent,
        safeAbsenceBuffer: metrics.safeAbsenceBuffer,
        recoveryNeeded: metrics.recoveryNeeded,
        status: metrics.status,
        priority: subject.priority,
        insights: metrics.insights
      };

      if (metrics.status === 'Critical' || metrics.status === 'Defaulter') {
        criticalSubjects.push(subjectData);
      } else if (metrics.status === 'At Risk') {
        atRiskSubjects.push(subjectData);
      } else {
        safeSubjects.push(subjectData);
      }

      for (const ins of metrics.insights) {
        allInsights.push({
          subjectId: subject._id,
          subjectName: subject.name,
          priority: subject.priority,
          ...ins
        });
      }
    }

    return sendSuccess(res, 200, 'Attendance insights generated.', {
      criticalSubjects,
      atRiskSubjects,
      safeSubjects,
      insights: allInsights
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Simulate "what if" attendance scenario
 * @route   POST /api/attendance/simulate
 * @access  Private
 */
export const simulateAttendance = async (req, res, next) => {
  try {
    const { subjectId, conducted, attended, minPercent, type, count } = req.body;

    let c = conducted;
    let a = attended;
    let p = minPercent;
    let subjectName = 'Custom Subject';

    // If subjectId provided, fetch actual subject values if not explicitly overridden
    if (subjectId) {
      const subject = await Subject.findOne({ _id: subjectId, userId: req.user._id });
      if (subject) {
        subjectName = subject.name;
        if (p === undefined) p = subject.minAttendancePercent;

        if (c === undefined || a === undefined) {
          const statsMap = await getSubjectStatsMap(req.user._id);
          const stats = statsMap.get(subject._id.toString()) || { conducted: 0, attended: 0 };
          c = stats.conducted;
          a = stats.attended;
        }
      }
    }

    const simulation = simulateScenario({
      conducted: c || 0,
      attended: a || 0,
      minPercent: p || 75,
      type: type || 'miss',
      count: count || 1
    });

    return sendSuccess(res, 200, 'What-if scenario simulated successfully.', {
      subjectName,
      ...simulation
    });
  } catch (error) {
    next(error);
  }
};
