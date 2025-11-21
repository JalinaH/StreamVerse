import { IUser } from '../models/User';

export const sanitizeUser = (user: IUser) => {
  const { _id, email, username, firstName, lastName, avatarUrl, createdAt, updatedAt } = user;
  return {
    id: _id.toString(),
    email,
    username,
    firstName,
    lastName,
    avatarUrl,
    createdAt,
    updatedAt,
  };
};
