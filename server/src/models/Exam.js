import mongoose from 'mongoose';

const examSchema = new mongoose.Schema(
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
    examType: {
      type: String,
      enum: ['midterm', 'final', 'quiz', 'practical', 'viva'],
      default: 'midterm'
    },
    date: {
      type: Date,
      required: [true, 'Exam date is required']
    },
    startTime: {
      type: String,
      trim: true,
      default: '10:00'
    },
    venue: {
      type: String,
      trim: true,
      default: ''
    },
    syllabus: {
      type: String,
      trim: true,
      default: ''
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

examSchema.index({ userId: 1, date: 1 });

const Exam = mongoose.model('Exam', examSchema);
export default Exam;
