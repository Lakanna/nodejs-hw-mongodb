import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { LoginUserSchema, RegisterUserSchema } from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserController,
  logoutUserController,
  refreshUserSessionController,
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

router.post('/logout', ctrlWrapper(logoutUserController));

router.post('/refresh', ctrlWrapper(refreshUserSessionController));

export default router;
