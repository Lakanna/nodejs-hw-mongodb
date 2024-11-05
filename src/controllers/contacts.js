import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

/**
  |============================
  | get all contacts controller
  |============================
*/
export const getAllContactsController = async (req, res) => {
  console.log(req.query, 'req query in controller');
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  console.log(filter, 'filter ai controller');
  const userId = req.user._id;

  // console.log(page, 'page', perPage, 'perPage in controller');

  const contacts = await getAllContacts({
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
    userId,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

/**
  |============================
  | get contact by id controller
  |============================
*/
export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await getContactById({ userId, contactId });

  if (!contact) {
    throw createHttpError(404, `Contact whit id ${contactId} not found`);
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

/**
  |============================
  | create contact controller
  |============================
*/
export const createContactController = async (req, res) => {
  const body = req.body;
  const userId = req.user._id;
  console.log(userId, 'userId in controller');

  const newContact = await createContact({ userId, body });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

/**
  |============================
  | update contact by id controller
  |============================
*/
export const updateContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const body = req.body;

  const updContact = await updateContact(contactId, body);

  if (updContact === null) {
    next(createHttpError(404, `Contact whith id ${contactId} not found`));
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updContact.contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const deletedContact = await deleteContact(contactId);

  if (!deletedContact) {
    next(createHttpError(404, `Contact with id ${contactId} not found`));
    return;
  }

  res.status(204).json({ status: 204 });
};

export const upsertContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const body = req.body;

  const upsertContact = await updateContact(contactId, body, { upsert: true });

  if (!upsertContact) {
    next(createHttpError(404, 'Not found'));
    return;
  }

  const status = upsertContact.isNew ? 201 : 200;
  res.status(status).json({
    status: status,
    message: '`Successfully upserted a contact!`',
    data: upsertContact.contact,
  });
};
