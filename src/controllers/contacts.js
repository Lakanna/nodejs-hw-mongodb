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
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { env } from '../utils/env.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

/**
  |============================
  | get all contacts controller
  |============================
*/
export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

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
  const userId = req.user._id.toString();

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
  const userId = req.user._id;

  let photoUrl;
  const photo = req.file;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const body = { ...req.body, photo: photoUrl };

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
  const { contactId: _id } = req.params;
  const userId = req.user._id;

  let photoUrl;

  const photo = req.file;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const options = {};
  const body = { ...req.body, photo: photoUrl };

  const updContact = await updateContact({ _id, body, options, userId });

  if (updContact === null) {
    next(createHttpError(404, `Contact whith id ${_id} not found`));
    return;
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updContact.contact,
  });
};

/**
  |============================
  | delete contact controller
  |============================
*/
export const deleteContactController = async (req, res, next) => {
  const { contactId: _id } = req.params;
  const userId = req.user._id;

  const deletedContact = await deleteContact({ _id, userId });

  if (!deletedContact) {
    next(createHttpError(404, `Contact with id ${_id} not found`));
    return;
  }

  res.status(204).json({ status: 204 });
};

/**
  |============================
  | upsert contact controller
  |============================
*/
export const upsertContactController = async (req, res, next) => {
  const { contactId: _id } = req.params;

  const userId = req.user._id;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const body = { ...req.body, photo: photoUrl };
  const options = { upsert: true };

  const upsertContact = await updateContact({
    _id,
    body,
    options,
    userId,
  });

  if (!upsertContact) {
    next(createHttpError(404, 'Not found'));
    return;
  }

  const status = upsertContact.isNew ? 201 : 200;
  res.status(status).json({
    status: status,
    message: 'Successfully upserted a contact!',
    data: upsertContact.contact,
  });
};

// export const addContactController = async (req,res)=>{
//    const {id: userId} = req.user;
//    let photo = null;
//    if(req.file){
//       if(enable_cloudinary === “true”){
//          photo =  await saveFileToCloudInary(req.file, “photo”);
//       }else{
//          await saveFileToUploadDir(req.file);
//          photo = path.join(“uploads”, req.file.filename);
//       };
//    }
//    const data = await contactServices.addContact({ ...req.body,   photo ,userId});
//    res.status(201).json({
//       status:201,
//       message:‘Successfully created a contact!’,
//       data,
//    });
// };
// export const updateContactController = async (req,res)=>{
//    const {id: _id} = req.params;
//    const { id: userId } = req.user;
//    let photo = null;
//    if (req.file) {
//       if (enable_cloudinary === “true”) {
//          photo = await saveFileToCloudInary(req.file, “photo”);
//       } else {
//          await saveFileToUploadDir(req.file);
//          photo = path.join(“uploads”, req.file.filename);
//       }
//    }
//    const result = await contactServices.updateContact({_id, userId, payload: { ...req.body, ...(photo && { photo }) },});
//    if(!result){
//       throw createHttpError(404,‘Contact not found’);
//    };
//    res.json({
//       status:200,
//       message:‘Successfully patched a contact!‘,
//       data:result,
//    });};
// contactsRouter.post(‘/’, upload.single(“photo”),  validateBody(contactAddSchema), ctrlWrapper(contactsController.addContactController));
// contactsRouter.patch(‘/:id’, isValidId ,upload.single(“photo”), validateBody(contactUpdateSchema), ctrlWrapper(contactsController.updateContactController)); (edited)
