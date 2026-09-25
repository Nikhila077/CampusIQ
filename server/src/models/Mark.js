import mongoose from 'mongoose';

const markSchema = new mongoose.Schema(
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
      required: [true, 'Subject is required'],
      index: true
    },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exam',
      default: null
    },
    examType: {
      type: String,
      trim: true,
      default: 'midterm'
    },
    marksObtained: {
      type: Number,
      required: [true, 'Marks obtained is required'],
      min: [0, 'Marks obtained cannot be negative']
    },
    totalMarks: {
      type: Number,
      required: [true, 'Total marks is required'],
      min: [1, 'Total marks must be greater than zero']
    },
    percentage: {
      type: Number,
      default: 0
    },
    grade: {
      type: String,
      trim: true,
      default: ''
    },
    semester: {
      type: Number,
      default: 1
    },
    remarks: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

markSchema.pre('save', function (next) {
  if (this.totalMarks > 0) {
    this.percentage = Number(((this.marksObtained / this.totalMarks) * 100).toFixed(2));
    if (!this.grade) {
      if (this.percentage >= 90) this.grade = 'A+';
      else if (this.percentage >= 80) this.grade = 'A';
      else if (this.percentage >= 70) this.grade = 'B';
      else if (this.percentage >= 60) this.grade = 'C';
      else if (this.percentage >= 50) this.grade = 'D';
      else this.grade = 'F';
    }
  }
  next();
});

markSchema.index({ userId: 1, semester: 1 });

const Mark = mongoose.model('Mark', markSchema);
export default Mark;
