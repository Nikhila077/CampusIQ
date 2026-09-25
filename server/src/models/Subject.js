import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true
    },
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true
    },
    code: {
      type: String,
      trim: true,
      uppercase: true,
      default: ''
    },
    faculty: {
      type: String,
      trim: true,
      default: ''
    },
    minAttendancePercent: {
      type: Number,
      default: 75,
      min: [0, 'Minimum attendance cannot be less than 0%'],
      max: [100, 'Minimum attendance cannot exceed 100%']
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    },
    semester: {
      type: Number,
      default: 1
    },
    credits: {
      type: Number,
      default: 3
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

// Compound index for querying a student's active subjects quickly
subjectSchema.index({ userId: 1, isActive: 1 });

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;
