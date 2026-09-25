import Assignment from '../models/Assignment.js';
import Subject from '../models/Subject.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * @desc    Get assignments for current student
 * @route   GET /api/assignments
 * @access  Private
 */
export const getAssignments = async (req, res, next) => {
  try {
    const { status, subjectId } = req.query;
    const filter = { userId: req.user._id };

    if (status) filter.status = status;
    if (subjectId) filter.subjectId = subjectId;

    const assignments = await Assignment.find(filter)
      .populate('subjectId', 'name code priority')
      .sort({ dueDate: 1 });

    return sendSuccess(res, 200, 'Assignments fetched.', { assignments });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new assignment
 * @route   POST /api/assignments
 * @access  Private
 */
export const createAssignment = async (req, res, next) => {
  try {
    const { subjectId, title, description, dueDate, priority } = req.body;

    if (!subjectId || !title || !dueDate) {
      return sendError(res, 400, 'Subject, title, and due date are required.');
    }

    const subject = await Subject.findOne({ _id: subjectId, userId: req.user._id });
    if (!subject) {
      return sendError(res, 404, 'Subject not found.');
    }

    const assignment = await Assignment.create({
      userId: req.user._id,
      subjectId,
      title: title.trim(),
      description: description ? description.trim() : '',
      dueDate: new Date(dueDate),
      status: 'pending',
      priority: ['high', 'medium', 'low'].includes(priority) ? priority : 'medium'
    });

    const populated = await assignment.populate('subjectId', 'name code priority');
    return sendSuccess(res, 201, 'Assignment created successfully.', { assignment: populated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update assignment details
 * @route   PUT /api/assignments/:id
 * @access  Private
 */
export const updateAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subjectId, title, description, dueDate, status, priority, grade } = req.body;

    const assignment = await Assignment.findOne({ _id: id, userId: req.user._id });
    if (!assignment) {
      return sendError(res, 404, 'Assignment not found.');
    }

    if (subjectId) {
      const subject = await Subject.findOne({ _id: subjectId, userId: req.user._id });
      if (!subject) {
        return sendError(res, 404, 'Subject not found.');
      }
      assignment.subjectId = subjectId;
    }

    if (title !== undefined) assignment.title = title.trim();
    if (description !== undefined) assignment.description = description.trim();
    if (dueDate !== undefined) assignment.dueDate = new Date(dueDate);
    if (priority !== undefined && ['high', 'medium', 'low'].includes(priority)) {
      assignment.priority = priority;
    }
    if (grade !== undefined) assignment.grade = grade.trim();

    if (status !== undefined && ['pending', 'submitted', 'late', 'missed'].includes(status)) {
      assignment.status = status;
      if (status === 'submitted' && !assignment.submittedAt) {
        assignment.submittedAt = new Date();
      } else if (status === 'pending') {
        assignment.submittedAt = null;
      }
    }

    await assignment.save();
    const populated = await assignment.populate('subjectId', 'name code priority');

    return sendSuccess(res, 200, 'Assignment updated successfully.', { assignment: populated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Quickly toggle or update assignment status (e.g., mark submitted)
 * @route   PUT /api/assignments/:id/status
 * @access  Private
 */
export const updateAssignmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'submitted', 'late', 'missed'].includes(status)) {
      return sendError(res, 400, 'Invalid assignment status.');
    }

    const assignment = await Assignment.findOne({ _id: id, userId: req.user._id });
    if (!assignment) {
      return sendError(res, 404, 'Assignment not found.');
    }

    assignment.status = status;
    if (status === 'submitted') {
      assignment.submittedAt = new Date();
    } else {
      assignment.submittedAt = null;
    }

    await assignment.save();
    const populated = await assignment.populate('subjectId', 'name code priority');

    return sendSuccess(res, 200, 'Assignment status updated.', { assignment: populated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete assignment
 * @route   DELETE /api/assignments/:id
 * @access  Private
 */
export const deleteAssignment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!assignment) {
      return sendError(res, 404, 'Assignment not found.');
    }

    return sendSuccess(res, 200, 'Assignment deleted successfully.');
  } catch (error) {
    next(error);
  }
};
