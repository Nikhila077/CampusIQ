import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
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
      required: [true, 'Subject is required']
    },
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required']
    },
    status: {
      type: String,
      enum: ['pending', 'submitted', 'late', 'missed'],
      default: 'pending'
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    },
    submittedAt: {
      type: Date,
      default: null
    },
    grade: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

assignmentSchema.index({ userId: 1, dueDate: 1 });

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
