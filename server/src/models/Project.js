import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner User ID is required'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    techStack: {
      type: [String],
      default: []
    },
    repoUrl: {
      type: String,
      trim: true,
      default: ''
    },
    liveUrl: {
      type: String,
      trim: true,
      default: ''
    },
    status: {
      type: String,
      enum: ['planning', 'in-progress', 'completed', 'paused'],
      default: 'in-progress'
    },
    isLookingForCollaborators: {
      type: Boolean,
      default: false
    },
    requiredSkills: {
      type: [String],
      default: []
    },
    teamSize: {
      type: Number,
      default: 1
    }
  },
  {
    timestamps: true
  }
);

projectSchema.index({ isLookingForCollaborators: 1, createdAt: -1 });

const Project = mongoose.model('Project', projectSchema);
export default Project;
