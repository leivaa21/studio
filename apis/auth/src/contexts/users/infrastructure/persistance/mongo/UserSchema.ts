import mongoose, { Schema } from 'mongoose';

const UserBasicCredentialsSchema = new Schema(
  {
    _type: {
      type: String,
      required: true,
      default: 'BASIC',
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

export const UserSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    credentials: {
      type: UserBasicCredentialsSchema,
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
