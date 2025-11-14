import { Schema, model } from 'mongoose';

interface Shortner {
  originalLink: string;
  shortLink: string;
  owner: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const shortnerSchema = new Schema(
  {
    originalLink: {
      type: String,
      required: [true, 'Original link is required'],
    },
    shortLink: {
      type: String,
      required: [true, 'Short link is required'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const shortnerModel = model<Shortner>('shortner', shortnerSchema);

export default shortnerModel;
