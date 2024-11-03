import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { LoginUserSchema, RegisterUserSchema } from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserController,
  registerController,
} from '../controllers/auth.js';

const router = Router();

router.post(
  '/register',
  validateBody(RegisterUserSchema),
  ctrlWrapper(registerController),
);

router.post(
  '/login',
  validateBody(LoginUserSchema),
  ctrlWrapper(loginUserController),
);

export default router;
