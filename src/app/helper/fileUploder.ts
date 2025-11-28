// import multer from 'multer';
// import path from 'path';
// import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs';
// import { ICloudinaryResponse } from '../interface';
// import AppError from '../error/appError';
// import config from '../config';

// cloudinary.config({
//   cloud_name: config.cloudinary.name!,
//   api_key: config.cloudinary.apiKey!,
//   api_secret: config.cloudinary.apiSecret!,
// });

// // Sanitize filename function
// const sanitizeFileName = (originalName: string) => {
//   return originalName
//     .replace(/\s+/g, '_') // space → underscore
//     .replace(/[^a-zA-Z0-9._-]/g, '') // remove special chars
//     .toLowerCase();
// };

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.join(process.cwd(), 'uploads'));
//   },
//   filename: function (req, file, cb) {
//     const safeName = Date.now() + '-' + sanitizeFileName(file.originalname);
//     cb(null, safeName);
//   },
// });

// // Multer instance (image + video support)
// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|mkv/;
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (allowedTypes.test(ext)) {
//       cb(null, true);
//     } else {
//       cb(new AppError(400, 'Only images and videos are allowed'));
//     }
//   },
//   // limits: {
//   //   fileSize: 50 * 1024 * 1024, // 50MB max
//   // },
// });

// const uploadToCloudinary = async (
//   file: Express.Multer.File,
// ): Promise<ICloudinaryResponse> => {
//   return new Promise<ICloudinaryResponse>((resolve, reject) => {
//     const safeName = sanitizeFileName(file.originalname);

//     // Detect resource type
//     const ext = path.extname(file.originalname).toLowerCase();
//     const isVideo = /mp4|mov|avi|mkv/.test(ext);

//     cloudinary.uploader.upload(
//       file.path,
//       {
//         public_id: safeName,
//         folder: 'File_Uploader',
//         resource_type: isVideo ? 'video' : 'image',
//         ...(isVideo
//           ? {} // no transformation for video by default
//           : { transformation: { width: 500, height: 500, crop: 'limit' } }),
//       },
//       (error, result) => {
//         fs.unlinkSync(file.path); // remove temp file
//         if (error) {
//           reject(error);
//         } else if (result) {
//           resolve(result as ICloudinaryResponse);
//         } else {
//           reject(
//             new AppError(
//               400,
//               'Upload failed: No result returned from Cloudinary',
//             ),
//           );
//         }
//       },
//     );
//   });
// };

// export const fileUploader = {
//   upload,
//   uploadToCloudinary,
// };

// ====================================no upload file========================================

import multer from 'multer';
import streamifier from 'streamifier';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
// import fs from "fs";
import AppError from '../error/appError';
import config from '../config';

// Cloudinary Config
cloudinary.config({
  cloud_name: config.cloudinary.name!,
  api_key: config.cloudinary.apiKey!,
  api_secret: config.cloudinary.apiSecret!,
});

// sanitize filename
const sanitizeFileName = (name: string) => {
  return name
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .toLowerCase();
};

// Multer (BUFFER BASED) → memoryStorage
export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|mkv/;
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new AppError(400, 'Only images & videos are allowed'));
    }
  },
});

// Upload to Cloudinary (stream)
export const uploadToCloudinary = (
  file: Express.Multer.File,
  folder: string = 'Note',
): Promise<{ url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new AppError(400, 'No file provided'));

    const ext = path.extname(file.originalname).toLowerCase();
    const isVideo = /mp4|mov|avi|mkv/.test(ext);

    const safeName = `${Date.now()}-${sanitizeFileName(file.originalname)}`;

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: isVideo ? 'video' : 'image',
        public_id: safeName,
        ...(isVideo
          ? {}
          : {
              transformation: {
                width: 500,
                height: 500,
                crop: 'limit',
              },
            }),
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new AppError(400, 'Cloudinary upload failed'));
        } else {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      },
    );

    // stream upload (no temp files needed)
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
