import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { RegisterUserSchema } from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerController } from '../controllers/auth.js';

const router = Router();

router.post(
  '/register',
  validateBody(RegisterUserSchema),
  ctrlWrapper(registerController),
);

export default router;
