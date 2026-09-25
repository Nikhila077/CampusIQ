import Timetable from '../models/Timetable.js';
import Subject from '../models/Subject.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

/**
 * @desc    Get full weekly timetable for student
 * @route   GET /api/timetable
 * @access  Private
 */
export const getTimetable = async (req, res, next) => {
  try {
    const slots = await Timetable.find({
      userId: req.user._id,
      isActive: true
    })
      .populate('subjectId', 'name code faculty minAttendancePercent priority')
      .sort({ startTime: 1 });

    return sendSuccess(res, 200, 'Timetable fetched.', { slots });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get today's scheduled classes
 * @route   GET /api/timetable/today
 * @access  Private
 */
export const getTodayClasses = async (req, res, next) => {
  try {
    const todayIndex = new Date().getDay();
    const todayDay = DAYS[todayIndex];

    const slots = await Timetable.find({
      userId: req.user._id,
      dayOfWeek: todayDay,
      isActive: true
    })
      .populate('subjectId', 'name code faculty minAttendancePercent priority')
      .sort({ startTime: 1 });

    return sendSuccess(res, 200, "Today's classes fetched.", {
      day: todayDay,
      slots
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a slot to timetable
 * @route   POST /api/timetable
 * @access  Private
 */
export const createTimetableSlot = async (req, res, next) => {
  try {
    const { subjectId, dayOfWeek, startTime, endTime, room, semester } = req.body;

    if (!subjectId || !dayOfWeek || !startTime || !endTime) {
      return sendError(res, 400, 'Subject, day of week, start time, and end time are required.');
    }

    const normDay = dayOfWeek.toLowerCase().trim();
    if (!DAYS.includes(normDay)) {
      return sendError(res, 400, `Day must be one of: ${DAYS.join(', ')}`);
    }

    const subject = await Subject.findOne({ _id: subjectId, userId: req.user._id });
    if (!subject) {
      return sendError(res, 404, 'Subject not found.');
    }

    const slot = await Timetable.create({
      userId: req.user._id,
      subjectId,
      dayOfWeek: normDay,
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      room: room ? room.trim() : '',
      semester: semester ? Number(semester) : (req.user.semester || 1),
      isActive: true
    });

    const populated = await slot.populate('subjectId', 'name code faculty priority');
    return sendSuccess(res, 201, 'Timetable slot created.', { slot: populated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a timetable slot
 * @route   PUT /api/timetable/:id
 * @access  Private
 */
export const updateTimetableSlot = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subjectId, dayOfWeek, startTime, endTime, room, semester, isActive } = req.body;

    const slot = await Timetable.findOne({ _id: id, userId: req.user._id });
    if (!slot) {
      return sendError(res, 404, 'Timetable slot not found.');
    }

    if (subjectId) {
      const subject = await Subject.findOne({ _id: subjectId, userId: req.user._id });
      if (!subject) {
        return sendError(res, 404, 'Subject not found.');
      }
      slot.subjectId = subjectId;
    }

    if (dayOfWeek) {
      const normDay = dayOfWeek.toLowerCase().trim();
      if (!DAYS.includes(normDay)) {
        return sendError(res, 400, `Day must be one of: ${DAYS.join(', ')}`);
      }
      slot.dayOfWeek = normDay;
    }

    if (startTime !== undefined) slot.startTime = startTime.trim();
    if (endTime !== undefined) slot.endTime = endTime.trim();
    if (room !== undefined) slot.room = room.trim();
    if (semester !== undefined) slot.semester = Number(semester);
    if (isActive !== undefined) slot.isActive = Boolean(isActive);

    await slot.save();
    const populated = await slot.populate('subjectId', 'name code faculty priority');

    return sendSuccess(res, 200, 'Timetable slot updated.', { slot: populated });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a timetable slot
 * @route   DELETE /api/timetable/:id
 * @access  Private
 */
export const deleteTimetableSlot = async (req, res, next) => {
  try {
    const { id } = req.params;

    const slot = await Timetable.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!slot) {
      return sendError(res, 404, 'Timetable slot not found.');
    }

    return sendSuccess(res, 200, 'Timetable slot deleted.');
  } catch (error) {
    next(error);
  }
};
