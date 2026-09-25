import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Opportunity title is required'],
      trim: true
    },
    type: {
      type: String,
      enum: ['internship', 'scholarship', 'competition', 'fellowship', 'hackathon', 'workshop'],
      required: [true, 'Opportunity type is required']
    },
    provider: {
      type: String,
      required: [true, 'Provider / Company name is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    deadline: {
      type: Date,
      default: null
    },
    eligibility: {
      type: String,
      trim: true,
      default: ''
    },
    applyLink: {
      type: String,
      trim: true,
      default: ''
    },
    tags: {
      type: [String],
      default: []
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

opportunitySchema.index({ type: 1, deadline: 1 });

const Opportunity = mongoose.model('Opportunity', opportunitySchema);
export default Opportunity;
