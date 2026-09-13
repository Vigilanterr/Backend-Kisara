import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadImage = upload.single('picture');

export const uploadToCloudinary = async (req: Request, res: Response, next: NextFunction) => {
  const file = (req as any).file;

  if (!file) {
    return next();
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return next();
  }

  try {
    const b64 = file.buffer.toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'blog_app',
    });

    (req as any).pictureUrl = result.secure_url;
    next();
  } catch (error) {
    next(error);
  }
};
