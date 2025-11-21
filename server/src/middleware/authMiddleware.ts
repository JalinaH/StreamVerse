import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config';
import { IUser, User } from '../models/User';

const extractToken = (authorizationHeader?: string) => {
  if (!authorizationHeader) return null;
  const [scheme, token] = authorizationHeader.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }
  return token.trim();
};

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing.' });
    }

    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    const userId = decoded?.sub as string | undefined;

    if (!userId) {
      return res.status(401).json({ message: 'Invalid authentication token.' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    req.user = user as IUser;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }
};
