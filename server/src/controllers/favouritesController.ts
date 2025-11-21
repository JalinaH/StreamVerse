import { NextFunction, Request, Response } from 'express';
import { FavouriteType, IFavouriteItem } from '../models/User';

interface FavouritePayload {
  id?: string;
  type?: FavouriteType;
  title?: string;
  description?: string;
  image?: string;
  status?: string;
}

const requireUser = (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized.' });
    return null;
  }
  return req.user;
};

const serializeFavourites = (items: IFavouriteItem[] = []) =>
  items.map((fav) => {
    const plain = typeof (fav as any).toObject === 'function' ? (fav as any).toObject() : fav;
    const { itemId, ...rest } = plain;
    return { id: itemId, ...rest };
  });

const mapFavourite = (payload: FavouritePayload): IFavouriteItem | null => {
  const { id, type, title, description, image, status } = payload;
  if (!id || !type || !title || !description || !image || !status) {
    return null;
  }

  const normalizedType = type.toLowerCase() as FavouriteType;
  if (!['movie', 'music', 'podcast'].includes(normalizedType)) {
    return null;
  }

  return {
    itemId: id,
    type: normalizedType,
    title,
    description,
    image,
    status,
    addedAt: new Date(),
  };
};

export const getFavourites = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;
    return res.json({ items: serializeFavourites(user.favourites ?? []) });
  } catch (error) {
    return next(error);
  }
};

export const addFavourite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const mapped = mapFavourite(req.body || {});
    if (!mapped) {
      return res.status(400).json({ message: 'Invalid favourite payload.' });
    }

    const alreadyExists = user.favourites?.some((fav) => fav.itemId === mapped.itemId);

    if (!alreadyExists) {
      user.favourites?.push(mapped);
      await user.save();
    }

    return res
      .status(alreadyExists ? 200 : 201)
      .json({ items: serializeFavourites(user.favourites ?? []) });
  } catch (error) {
    return next(error);
  }
};

export const removeFavourite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = requireUser(req, res);
    if (!user) return;

    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({ message: 'Missing favourite id.' });
    }

    const initialCount = user.favourites?.length ?? 0;
    user.favourites = user.favourites?.filter((fav) => fav.itemId !== itemId) ?? [];

    if ((user.favourites?.length ?? 0) !== initialCount) {
      await user.save();
    }

    return res.status(200).json({ items: serializeFavourites(user.favourites ?? []) });
  } catch (error) {
    return next(error);
  }
};
