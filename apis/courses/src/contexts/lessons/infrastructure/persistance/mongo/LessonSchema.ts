import mongoose, { Schema } from 'mongoose';

export const LessonSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      unique: true,
    },
    courseId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
    updatedAt: {
      type: Date,
      required: true,
    },
  },
  { versionKey: false, timestamps: false }
);

const LessonModel = mongoose.model('Lesson', LessonSchema);
export { LessonModel };
