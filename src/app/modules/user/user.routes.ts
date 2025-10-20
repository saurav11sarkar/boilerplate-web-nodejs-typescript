import express from 'express';
import { userController } from './user.controller';
import validationRequest from '../../middlewares/validationRequest';
import { userValidation } from './user.validation';
import auth from '../../middlewares/auth';
import { fileUploader } from '../../helper/fileUploder';
import { userRole } from './user.constant';

const router = express.Router();

router.post(
  '/create-user',
  validationRequest(userValidation.userSchema),
  userController.createUser,
);

router.get(
  '/profile',
  auth(userRole.admin, userRole.contractor, userRole.user),
  userController.profile,
);
router.put(
  '/profile',
  auth(userRole.admin, userRole.contractor, userRole.user),
  fileUploader.upload.single('profileImage'),
  userController.updateUserById,
);

router.get('/all-user', auth(userRole.admin), userController.getAllUser);
router.get('/:id', auth(userRole.admin), userController.getUserById);

router.delete('/:id', auth(userRole.admin), userController.deleteUserById);

export const userRoutes = router;
