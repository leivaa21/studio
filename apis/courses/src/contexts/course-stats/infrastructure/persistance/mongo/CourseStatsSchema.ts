import mongoose, { Schema } from 'mongoose';

export const CourseStatsSchema = new Schema(
  {
    courseId: {
      type: String,
      required: true,
      unique: true,
    },
    subscriptions: {
      type: Number,
      required: true,
      default: 0,
    },
    timesCompleted: {
      type: Number,
      required: true,
      default: 0,
    },
    currentSubscriptions: {
      type: Number,
      required: true,
      default: 0,
    },
    currentTimesCompleted: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { versionKey: false, timestamps: false }
);

const CourseStatsModel = mongoose.model('CourseStats', CourseStatsSchema);
export { CourseStatsModel };
