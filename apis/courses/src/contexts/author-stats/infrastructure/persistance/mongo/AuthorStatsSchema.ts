import mongoose, { Schema } from 'mongoose';

export const AuthorStatsSchema = new Schema(
  {
    authorId: {
      type: String,
      required: true,
      unique: true,
    },
    coursesCreated: {
      type: Number,
      required: true,
      default: 0,
    },
    lessonsCreated: {
      type: Number,
      required: true,
      default: 0,
    },
    coursesPublished: {
      type: Number,
      required: true,
      default: 0,
    },
    subscriptionsToOwnCourses: {
      type: Number,
      required: true,
      default: 0,
    },
    currentCourses: {
      type: Number,
      required: true,
      default: 0,
    },
    currentLessons: {
      type: Number,
      required: true,
      default: 0,
    },
    currentCoursesPublished: {
      type: Number,
      required: true,
      default: 0,
    },
    currentSubscriptionsToOwnCourses: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { versionKey: false, timestamps: false, _id: false }
);

const AuthorStatsModel = mongoose.model('AuthorStats', AuthorStatsSchema);
export { AuthorStatsModel };
