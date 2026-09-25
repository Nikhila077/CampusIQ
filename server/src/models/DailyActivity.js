import mongoose from 'mongoose';

const dailyActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true
    },
    completedActions: {
      type: [String],
      default: []
    },
    dailyGoal: {
      type: Number,
      default: 3
    },
    xpEarned: {
      type: Number,
      default: 0
    },
    brainBoostCompleted: {
      type: Boolean,
      default: false
    },
    brainBoostQuestionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BrainBoostQuestion',
      default: null
    },
    plannerCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

dailyActivitySchema.index({ userId: 1, date: 1 }, { unique: true });

const DailyActivity = mongoose.model('DailyActivity', dailyActivitySchema);
export default DailyActivity;
