import Subject from '../models/Subject.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * @desc    Get all subjects for current student
 * @route   GET /api/subjects
 * @access  Private
 */
export const getSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find({
      userId: req.user._id,
      isActive: true
    }).sort({ priority: 1, name: 1 });

    return sendSuccess(res, 200, 'Subjects fetched successfully.', { subjects });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new subject
 * @route   POST /api/subjects
 * @access  Private
 */
export const createSubject = async (req, res, next) => {
  try {
    const { name, code, faculty, minAttendancePercent, priority, semester, credits } = req.body;

    if (!name || !name.trim()) {
      return sendError(res, 400, 'Subject name is required.');
    }

    const minPct = minAttendancePercent !== undefined ? Number(minAttendancePercent) : 75;
    if (isNaN(minPct) || minPct < 0 || minPct > 100) {
      return sendError(res, 400, 'Minimum attendance must be a number between 0 and 100.');
    }

    const validPriorities = ['high', 'medium', 'low'];
    const chosenPriority = validPriorities.includes(priority) ? priority : 'medium';

    const subject = await Subject.create({
      userId: req.user._id,
      name: name.trim(),
      code: code ? code.trim().toUpperCase() : '',
      faculty: faculty ? faculty.trim() : '',
      minAttendancePercent: minPct,
      priority: chosenPriority,
      semester: semester ? Number(semester) : (req.user.semester || 1),
      credits: credits ? Number(credits) : 3,
      isActive: true
    });

    return sendSuccess(res, 201, 'Subject created successfully.', { subject });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing subject
 * @route   PUT /api/subjects/:id
 * @access  Private
 */
export const updateSubject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, code, faculty, minAttendancePercent, priority, semester, credits, isActive } = req.body;

    const subject = await Subject.findOne({ _id: id, userId: req.user._id });
    if (!subject) {
      return sendError(res, 404, 'Subject not found or you do not have permission to modify it.');
    }

    if (name !== undefined) subject.name = name.trim();
    if (code !== undefined) subject.code = code.trim().toUpperCase();
    if (faculty !== undefined) subject.faculty = faculty.trim();
    if (minAttendancePercent !== undefined) {
      const minPct = Number(minAttendancePercent);
      if (isNaN(minPct) || minPct < 0 || minPct > 100) {
        return sendError(res, 400, 'Minimum attendance must be between 0 and 100.');
      }
      subject.minAttendancePercent = minPct;
    }
    if (priority !== undefined && ['high', 'medium', 'low'].includes(priority)) {
      subject.priority = priority;
    }
    if (semester !== undefined) subject.semester = Number(semester);
    if (credits !== undefined) subject.credits = Number(credits);
    if (isActive !== undefined) subject.isActive = Boolean(isActive);

    await subject.save();
    return sendSuccess(res, 200, 'Subject updated successfully.', { subject });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a subject (soft delete or hard delete)
 * @route   DELETE /api/subjects/:id
 * @access  Private
 */
export const deleteSubject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const subject = await Subject.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!subject) {
      return sendError(res, 404, 'Subject not found or you do not have permission to delete it.');
    }

    return sendSuccess(res, 200, 'Subject deleted successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Quickly update subject priority preference
 * @route   PUT /api/subjects/:id/priority
 * @access  Private
 */
export const updateSubjectPriority = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    if (!priority || !['high', 'medium', 'low'].includes(priority)) {
      return sendError(res, 400, 'Priority must be either "high", "medium", or "low".');
    }

    const subject = await Subject.findOne({ _id: id, userId: req.user._id });
    if (!subject) {
      return sendError(res, 404, 'Subject not found.');
    }

    subject.priority = priority;
    await subject.save();

    return sendSuccess(res, 200, 'Subject priority updated successfully.', { subject });
  } catch (error) {
    next(error);
  }
};
