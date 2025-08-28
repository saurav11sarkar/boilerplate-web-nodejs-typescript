import express from 'express';
import { userController } from './user.controller';
import validationRequest from '../../middlewares/validationRequest';
import { userValidation } from './user.validation';
import auth from '../../middlewares/auth';
import { fileUploader } from '../../helper/fileUploder';

const router = express.Router();

router.post(
  '/create-user',
  validationRequest(userValidation.userSchema),
  userController.createUser,
);
router.get('/get-all-user', userController.getAllUser);

router.get('/get-user/:id', auth('admin', 'user'), userController.getUserById);

router.put(
  '/update-user/:id',
  auth('admin', 'user'),
  fileUploader.upload.single('profileImage'),
  validationRequest(userValidation.updateUserSchema),
  userController.updateUserById,
);

router.delete('/delete-user/:id', auth('admin'), userController.deleteUserById);

export const userRoutes = router;
