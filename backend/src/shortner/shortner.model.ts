import { Schema, model } from 'mongoose';

interface Shortner {
  originalLink: string;
  shortLink: string;
  //owner,
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const shortnerModel = model<Shortner>('shortner', shortnerSchema);

export default shortnerModel;
