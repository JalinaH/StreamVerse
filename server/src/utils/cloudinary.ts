import { UploadApiOptions, UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { config } from '../config';

const initialized = (() => {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
  return true;
})();

const buildAvatarPublicId = (userId: string) => `${config.cloudinary.folder}/avatars/${userId}`;

export const uploadAvatarImage = async (
  file: string,
  userId: string,
  options?: UploadApiOptions,
): Promise<UploadApiResponse> => {
  if (!initialized) {
    throw new Error('Cloudinary not initialized');
  }

  return cloudinary.uploader.upload(file, {
    folder: `${config.cloudinary.folder}/avatars`,
    public_id: userId,
    overwrite: true,
    invalidate: true,
    ...options,
  });
};

export const deleteAvatarImage = async (userId: string) => {
  if (!initialized) {
    throw new Error('Cloudinary not initialized');
  }

  return cloudinary.uploader.destroy(buildAvatarPublicId(userId), {
    invalidate: true,
  });
};
