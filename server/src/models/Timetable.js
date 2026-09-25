import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: [true, 'Subject ID is required']
    },
    dayOfWeek: {
      type: String,
      enum: {
        values: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
        message: '{VALUE} is not a valid day of the week'
      },
      lowercase: true,
      required: [true, 'Day of week is required']
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required']
    },
    endTime: {
      type: String,
      required: [true, 'End time is required']
    },
    room: {
      type: String,
      trim: true,
      default: ''
    },
    semester: {
      type: Number,
      default: 1
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

timetableSchema.index({ userId: 1, dayOfWeek: 1 });

const Timetable = mongoose.model('Timetable', timetableSchema);
export default Timetable;
