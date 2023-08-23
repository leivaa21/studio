import mongoose, { Schema } from 'mongoose';

export const ConsumerStatsSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    subscribedCourses: {
      type: Number,
      required: true,
      default: 0,
    },
    completedCourses: {
      type: Number,
      required: true,
      default: 0,
    },
    currentSubscribedCourses: {
      type: Number,
      required: true,
      default: 0,
    },
    currentCompletedCourses: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { versionKey: false, timestamps: false }
);

const ConsumerStatsModel = mongoose.model('ConsumerStats', ConsumerStatsSchema);
export { ConsumerStatsModel };
