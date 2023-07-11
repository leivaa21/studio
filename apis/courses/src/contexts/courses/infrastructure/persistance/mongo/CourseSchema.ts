import mongoose, { Schema } from 'mongoose';

export const CourseSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
      unique: true,
    },
    authorId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
    },
  },
  { versionKey: false, timestamps: false }
);

const CourseModel = mongoose.model('Course', CourseSchema);
export { CourseModel };