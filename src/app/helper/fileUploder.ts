import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { ICloudinaryResponse } from '../interface';
import AppError from '../error/appError';
import config from '../config';

cloudinary.config({
  cloud_name: config.cloudinary.name,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

// Sanitize filename function
const sanitizeFileName = (originalName: string) => {
  return originalName
    .replace(/\s+/g, '_') // space → underscore
    .replace(/[^a-zA-Z0-9._-]/g, '') // remove special chars
    .toLowerCase();
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: function (req, file, cb) {
    const safeName = sanitizeFileName(file.originalname);
    cb(null, safeName);
  },
});

const upload = multer({ storage });

const uploadToCloudinary = async (
  file: Express.Multer.File,
): Promise<ICloudinaryResponse> => {
  return new Promise<ICloudinaryResponse>((resolve, reject) => {
    const safeName = sanitizeFileName(file.originalname);

    cloudinary.uploader.upload(
      file.path,
      {
        public_id: safeName,
        folder: 'File_Uploader',
        resource_type: 'auto',
        transformation: { width: 500, height: 500, crop: 'limit' },
      },
      (error, result) => {
        fs.unlinkSync(file.path); // remove temp file
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result as ICloudinaryResponse);
        } else {
          reject(
            new AppError(
              400,
              'Upload failed: No result returned from Cloudinary',
            ),
          );
        }
      },
    );
  });
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
