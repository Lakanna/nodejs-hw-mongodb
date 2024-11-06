import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  updateContactController,
  upsertContactController,
} from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';

import {
  createContactsSchema,
  updateContactSchema,
} from '../validation/contacts.js';

import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorization } from '../middlewares/authorization.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.use(authorization);

contactsRouter.get('/', ctrlWrapper(getAllContactsController));

contactsRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);

contactsRouter.post(
  '/',
  validateBody(createContactsSchema),
  ctrlWrapper(createContactController),
);

contactsRouter.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(upsertContactController),
);

contactsRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);

contactsRouter.put(
  '/:contactId',
  isValidId,
  validateBody(createContactsSchema),
  ctrlWrapper(updateContactController),
);

export default contactsRouter;
