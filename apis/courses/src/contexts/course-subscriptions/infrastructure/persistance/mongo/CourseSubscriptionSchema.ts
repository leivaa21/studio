import mongoose, { Schema } from 'mongoose';

export const CourseSubscriptionSchema = new Schema(
  {
    _id: String,
    userId: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
    },
    subscribedAt: {
      type: Date,
      required: true,
    },
    updatedAt: {
      type: Date,
      required: true,
    },
    completedLessons: {
      type: [String],
      required: true,
    },
    completed: {
      type: Boolean,
      required: true,
    },
  },
  { versionKey: false, timestamps: false }
);

const CourseSubscriptionModel = mongoose.model(
  'CourseSubscription',
  CourseSubscriptionSchema
);

export { CourseSubscriptionModel };
