import { NextFunction, Request, Response } from 'express';
import { IUser, User } from '../models/User';
import { deleteAvatarImage, uploadAvatarImage } from '../utils/cloudinary';
import { sanitizeUser } from '../utils/sanitizeUser';

const requireUser = (req: Request, res: Response): IUser | null => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized.' });
    return null;
  }
  return req.user;
};

const normalizeString = (value?: string) => (typeof value === 'string' ? value.trim() : undefined);

const ensureUniqueField = async (
  field: 'email' | 'username',
  value: string,
  currentUserId: string,
) => {
  const normalized = normalizeString(value);
  if (!normalized) {
    throw new Error(`${field === 'email' ? 'Email' : 'Username'} is required.`);
  }
  const queryValue = normalized.toLowerCase();
  const existing = await User.findOne({ [field]: queryValue });
  if (existing && existing._id.toString() !== currentUserId) {
    throw new Error(`Another user already uses that ${field}.`);
  }
  return queryValue;
};

export const getProfile = async (req: Request, res: Response) => {
  const user = requireUser(req, res);
  if (!user) return;
  res.json({ user: sanitizeUser(user) });
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const { firstName, lastName, username, email, avatarBase64 } = req.body || {};

    const normalizedUsername = normalizeString(username);
    if (normalizedUsername && normalizedUsername.toLowerCase() !== user.username) {
      user.username = await ensureUniqueField('username', normalizedUsername, user._id.toString());
    }

    const normalizedEmail = normalizeString(email);
    if (normalizedEmail && normalizedEmail.toLowerCase() !== user.email) {
      user.email = await ensureUniqueField('email', normalizedEmail, user._id.toString());
    }

    const normalizedFirst = normalizeString(firstName);
    const normalizedLast = normalizeString(lastName);

    if (normalizedFirst) {
      user.firstName = normalizedFirst;
    }
    if (normalizedLast) {
      user.lastName = normalizedLast;
    }

    if (avatarBase64 && typeof avatarBase64 === 'string') {
      const uploaded = await uploadAvatarImage(avatarBase64, user._id.toString());
      user.avatarUrl = uploaded.secure_url;
    }

    await user.save();

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    if (error instanceof Error && error.message.includes('already uses')) {
      return res.status(409).json({ message: error.message });
    }
    return next(error);
  }
};

export const deleteProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    await Promise.all([
      User.findByIdAndDelete(user._id),
      user.avatarUrl ? deleteAvatarImage(user._id.toString()) : Promise.resolve(null),
    ]);

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
