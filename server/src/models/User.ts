import { Document, model, Schema } from 'mongoose';

export type FavouriteType = 'movie' | 'music' | 'podcast';

export interface IFavouriteItem {
  itemId: string;
  type: FavouriteType;
  title: string;
  description: string;
  image: string;
  status: string;
  addedAt: Date;
}

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  favourites: IFavouriteItem[];
  createdAt: Date;
  updatedAt: Date;
}

const favouriteSchema = new Schema<IFavouriteItem>(
  {
    itemId: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['movie', 'music', 'podcast'],
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    status: { type: String, required: true, trim: true },
    addedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    favourites: {
      type: [favouriteSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
