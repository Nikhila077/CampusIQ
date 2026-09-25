import mongoose from 'mongoose';

const brainBoostQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question prompt is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    options: {
      type: [String],
      required: [true, 'Options are required'],
      validate: [val => val.length >= 2, 'At least 2 options are required']
    },
    correctAnswer: {
      type: Number,
      required: [true, 'Correct answer index is required']
    },
    explanation: {
      type: String,
      required: [true, 'Explanation is required'],
      trim: true
    },
    targetRoles: {
      type: [String],
      default: []
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

brainBoostQuestionSchema.index({ category: 1, isActive: 1 });

const BrainBoostQuestion = mongoose.model('BrainBoostQuestion', brainBoostQuestionSchema);
export default BrainBoostQuestion;
