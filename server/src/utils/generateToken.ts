import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';

export const generateToken = (userId: string) =>
  jwt.sign({ sub: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'],
  });
