import Exam from '../models/Exam.js';
import Subject from '../models/Subject.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * @desc    Get all exams for student
 * @route   GET /api/exams
 * @access  Private
 */
export const getExams = async (req, res, next) => {
  try {
    const { upcoming } = req.query;
    const filter = { userId: req.user._id };

    if (upcoming === 'true') {
      filter.date = { $gte: new Date(new Date().setHours(0, 0, 0, 0)) };
      filter.isCompleted = false;
    }

    const exams = await Exam.find(filter)
      .populate('subjectId', 'name code priority')
      .sort({ date: 1, startTime: 1 });

    return sendSuccess(res, 200, 'Exams fetched.', { exams });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add an exam
 * @route   POST /api/exams
 * @access  Private
 */
export const createExam = async (req, res, next) => {
  try {
    const { subjectId, examType, date, startTime, venue, syllabus } = req.body;

    if (!subjectId || !date) {
      return sendError(res, 400, 'Subject and exam date are required.');
    }

    const subject = await Subject.findOne({ _id: subjectId, userId: req.user._id });
    if (!subject) {
      return sendError(res, 404, 'Subject not found.');
    }

    const exam = await Exam.create({
      userId: req.user._id,
      subjectId,
      examType: ['midterm', 'final', 'quiz', 'practical', 'viva'].includes(examType)
        ? examType
        : 'midterm',
      date: new Date(date),
      startTime: startTime ? startTime.trim() : '10:00',
      venue: venue ? venue.trim() : '',
      syllabus: syllabus ? syllabus.trim() : '',
      isCompleted: false
    });

    const populated = await exam.populate('subjectId', 'name code priority');
    return sendSuccess(res, 201, 'Exam scheduled successfully.', { exam: populated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update exam
 * @route   PUT /api/exams/:id
 * @access  Private
 */
export const updateExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subjectId, examType, date, startTime, venue, syllabus, isCompleted } = req.body;

    const exam = await Exam.findOne({ _id: id, userId: req.user._id });
    if (!exam) {
      return sendError(res, 404, 'Exam not found.');
    }

    if (subjectId) {
      const subject = await Subject.findOne({ _id: subjectId, userId: req.user._id });
      if (!subject) {
        return sendError(res, 404, 'Subject not found.');
      }
      exam.subjectId = subjectId;
    }

    if (examType && ['midterm', 'final', 'quiz', 'practical', 'viva'].includes(examType)) {
      exam.examType = examType;
    }
    if (date !== undefined) exam.date = new Date(date);
    if (startTime !== undefined) exam.startTime = startTime.trim();
    if (venue !== undefined) exam.venue = venue.trim();
    if (syllabus !== undefined) exam.syllabus = syllabus.trim();
    if (isCompleted !== undefined) exam.isCompleted = Boolean(isCompleted);

    await exam.save();
    const populated = await exam.populate('subjectId', 'name code priority');

    return sendSuccess(res, 200, 'Exam updated successfully.', { exam: populated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete exam
 * @route   DELETE /api/exams/:id
 * @access  Private
 */
export const deleteExam = async (req, res, next) => {
  try {
    const { id } = req.params;

    const exam = await Exam.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!exam) {
      return sendError(res, 404, 'Exam not found.');
    }

    return sendSuccess(res, 200, 'Exam deleted successfully.');
  } catch (error) {
    next(error);
  }
};
