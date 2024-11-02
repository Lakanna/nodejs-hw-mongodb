import { Router } from 'express';
import ContactsRouter from './contacts.js';
import UsersRouter from './auth.js';

const router = Router();

router.use('/contacts', ContactsRouter);
router.use('/auth', UsersRouter);

export default router;
