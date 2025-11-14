import { Schema, model } from 'mongoose';

interface Shortner {
  originalLink: string;
  shortLink: string;
  owner: Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  checkOwner: (userId: string) => boolean;
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

shortnerSchema.methods.checkOwner = function (userId: string) {
  return this.owner.toString() === userId;
};

const shortnerModel = model<Shortner>('shortner', shortnerSchema);

export default shortnerModel;
