import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';

export const getAllContactsController = async (req, res) => {
  const contacts = await getAllContacts();

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;

  const contact = await getContactById(contactId);

  if (!contact) {
    throw createHttpError(404, `Contact whit id ${contactId} not found`);
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const body = req.body;

  if (body.name && body.phoneNumber && body.contactType) {
    const newContact = await createContact(body);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  }

  throw createHttpError(500, 'Incorrect body of request');
};

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
    data: updContact,
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
