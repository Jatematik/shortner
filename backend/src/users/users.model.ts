import { Document, Model, Schema, model } from 'mongoose';
import jwt from 'jsonwebtoken';
import { compare, genSalt, hash } from 'bcryptjs';
import NotAuthorizedError from '../errors/not-authorized-error';

interface IUser {
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  generateAccessToken: () => string;
}

interface UserDoc extends Document, IUser {}

interface UserModel extends Model<UserDoc> {
  findUserByCredentials: (
    email: string,
    password: string
  ) => Promise<UserDoc | never>;
}

const usersSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          return emailRegex.test(value);
        },
        message: 'Email is not valid.',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      validate: {
        validator: (value: string) => {
          const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
          return passwordRegex.test(value);
        },
        message:
          'Password must contain at least one uppercase letter, one lowercase letter and one number',
      },
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        return ret;
      },
    },
  }
);

usersSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      const salt = await genSalt(8);
      this.password = await hash(this.password, salt);
    }
  } catch (error) {
    next();
  }
});

usersSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '1h',
    }
  );
};

usersSchema.statics.findUserByCredentials = async function (
  email: string,
  password: string
) {
  const user = await this.findOne({ email })
    .select('+password')
    .orFail(
      () => new NotAuthorizedError('User with provided credentials not found')
    );

  const isCorrectPassword = await compare(password, user.password);

  if (!isCorrectPassword) {
    throw new NotAuthorizedError('Invalid credentials');
  }

  return user;
};

const usersModel = model<IUser, UserModel>('users', usersSchema);

export default usersModel;
