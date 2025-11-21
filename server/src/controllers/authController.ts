import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils/generateToken';
import { sanitizeUser } from '../utils/sanitizeUser';

const SALT_ROUNDS = 10;

const buildAuthPayload = (userId: string) => ({
  token: generateToken(userId),
});

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username, password, firstName, lastName, avatarUrl } = req.body || {};

    if (!email || !username || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'Email, username, password, first name and last name are required.' });
    }

    const normalizedEmail = String(email).toLowerCase();
    const normalizedUsername = String(username).toLowerCase();

    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
    });

    if (existingUser) {
      return res.status(409).json({ message: 'A user with that email or username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(String(password), SALT_ROUNDS);
    const user = await User.create({
      email: normalizedEmail,
      username: normalizedUsername,
      password: hashedPassword,
      firstName,
      lastName,
      avatarUrl,
    });

    const responsePayload = {
      ...buildAuthPayload(user._id.toString()),
      user: sanitizeUser(user),
    };

    return res.status(201).json(responsePayload);
  } catch (error) {
    return next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, identifier, password } = req.body || {};

    const lookupValue = String(identifier || username || email || '').toLowerCase();

    if (!lookupValue || !password) {
      return res.status(400).json({ message: 'Username/email and password are required.' });
    }

    const user = await User.findOne({
      $or: [{ email: lookupValue }, { username: lookupValue }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isValidPassword = await bcrypt.compare(String(password), user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const responsePayload = {
      ...buildAuthPayload(user._id.toString()),
      user: sanitizeUser(user),
    };

    return res.status(200).json(responsePayload);
  } catch (error) {
    return next(error);
  }
};
