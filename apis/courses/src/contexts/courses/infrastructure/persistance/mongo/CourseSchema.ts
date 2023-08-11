import mongoose, { Schema } from 'mongoose';

export const CourseSchema = new Schema(
  {
    _id: String,
    authorId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
      default: [],
    },
    description: {
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
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  { versionKey: false, timestamps: false }
);

const CourseModel = mongoose.model('Course', CourseSchema);
export { CourseModel };
