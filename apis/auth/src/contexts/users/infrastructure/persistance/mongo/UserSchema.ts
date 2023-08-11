import mongoose, { Schema } from 'mongoose';

const UserCredentialsSchema = new Schema(
  {
    _type: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },
    githubId: {
      type: Number,
    },
  },
  { _id: false }
);

export const UserSchema = new Schema(
  {
    _id: String,
    nickname: {
      type: String,
      required: true,
    },
    credentials: {
      type: UserCredentialsSchema,
      required: true,
    },
    verified: {
      type: Boolean,
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

const UserModel = mongoose.model('User', UserSchema);
export { UserModel };
