import Mark from '../models/Mark.js';
import Subject from '../models/Subject.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * @desc    Get all marks for current student with aggregated analysis
 * @route   GET /api/marks
 * @access  Private
 */
export const getMarks = async (req, res, next) => {
  try {
    const { semester, subjectId } = req.query;
    const filter = { userId: req.user._id };

    if (semester) filter.semester = Number(semester);
    if (subjectId) filter.subjectId = subjectId;

    const marks = await Mark.find(filter)
      .populate('subjectId', 'name code credits priority')
      .populate('examId', 'examType date venue')
      .sort({ createdAt: -1 });

    // Calculate overall stats
    let totalObtained = 0;
    let totalMax = 0;

    for (const m of marks) {
      totalObtained += m.marksObtained;
      totalMax += m.totalMarks;
    }

    const overallPercentage =
      totalMax > 0 ? Number(((totalObtained / totalMax) * 100).toFixed(2)) : 0;

    let overallGrade = 'N/A';
    if (totalMax > 0) {
      if (overallPercentage >= 90) overallGrade = 'A+';
      else if (overallPercentage >= 80) overallGrade = 'A';
      else if (overallPercentage >= 70) overallGrade = 'B';
      else if (overallPercentage >= 60) overallGrade = 'C';
      else if (overallPercentage >= 50) overallGrade = 'D';
      else overallGrade = 'F';
    }

    return sendSuccess(res, 200, 'Marks fetched successfully.', {
      marks,
      summary: {
        totalAssessments: marks.length,
        totalObtained,
        totalMax,
        overallPercentage,
        overallGrade
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get marks for a specific subject
 * @route   GET /api/marks/subject/:subjectId
 * @access  Private
 */
export const getSubjectMarks = async (req, res, next) => {
  try {
    const { subjectId } = req.params;

    const marks = await Mark.find({
      userId: req.user._id,
      subjectId
    })
      .populate('subjectId', 'name code')
      .populate('examId', 'examType date')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Subject marks fetched.', { marks });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new mark entry
 * @route   POST /api/marks
 * @access  Private
 */
export const createMark = async (req, res, next) => {
  try {
    const {
      subjectId,
      examId,
      examType,
      marksObtained,
      totalMarks,
      grade,
      semester,
      remarks
    } = req.body;

    if (!subjectId || marksObtained === undefined || totalMarks === undefined) {
      return sendError(res, 400, 'Subject, marks obtained, and total marks are required.');
    }

    const obtained = Number(marksObtained);
    const total = Number(totalMarks);

    if (isNaN(obtained) || obtained < 0) {
      return sendError(res, 400, 'Marks obtained must be a non-negative number.');
    }

    if (isNaN(total) || total <= 0) {
      return sendError(res, 400, 'Total marks must be greater than zero.');
    }

    if (obtained > total) {
      return sendError(res, 400, 'Marks obtained cannot exceed total marks.');
    }

    const subject = await Subject.findOne({ _id: subjectId, userId: req.user._id });
    if (!subject) {
      return sendError(res, 404, 'Subject not found.');
    }

    const mark = await Mark.create({
      userId: req.user._id,
      subjectId,
      examId: examId || null,
      examType: examType ? examType.trim() : 'midterm',
      marksObtained: obtained,
      totalMarks: total,
      grade: grade ? grade.trim().toUpperCase() : '',
      semester: semester ? Number(semester) : (subject.semester || 1),
      remarks: remarks ? remarks.trim() : ''
    });

    const populated = await mark.populate('subjectId', 'name code credits');
    return sendSuccess(res, 201, 'Mark recorded successfully.', { mark: populated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a mark entry
 * @route   PUT /api/marks/:id
 * @access  Private
 */
export const updateMark = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      subjectId,
      examId,
      examType,
      marksObtained,
      totalMarks,
      grade,
      semester,
      remarks
    } = req.body;

    const mark = await Mark.findOne({ _id: id, userId: req.user._id });
    if (!mark) {
      return sendError(res, 404, 'Mark record not found.');
    }

    if (subjectId) {
      const subject = await Subject.findOne({ _id: subjectId, userId: req.user._id });
      if (!subject) return sendError(res, 404, 'Subject not found.');
      mark.subjectId = subjectId;
    }

    const obtained = marksObtained !== undefined ? Number(marksObtained) : mark.marksObtained;
    const total = totalMarks !== undefined ? Number(totalMarks) : mark.totalMarks;

    if (obtained < 0 || total <= 0 || obtained > total) {
      return sendError(res, 400, 'Invalid marks obtained or total marks.');
    }

    mark.marksObtained = obtained;
    mark.totalMarks = total;
    if (examId !== undefined) mark.examId = examId || null;
    if (examType !== undefined) mark.examType = examType.trim();
    if (grade !== undefined) mark.grade = grade.trim().toUpperCase();
    if (semester !== undefined) mark.semester = Number(semester);
    if (remarks !== undefined) mark.remarks = remarks.trim();

    await mark.save();
    const populated = await mark.populate('subjectId', 'name code credits');

    return sendSuccess(res, 200, 'Mark record updated.', { mark: populated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a mark entry
 * @route   DELETE /api/marks/:id
 * @access  Private
 */
export const deleteMark = async (req, res, next) => {
  try {
    const { id } = req.params;

    const mark = await Mark.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!mark) {
      return sendError(res, 404, 'Mark record not found.');
    }

    return sendSuccess(res, 200, 'Mark record deleted.');
  } catch (error) {
    next(error);
  }
};
