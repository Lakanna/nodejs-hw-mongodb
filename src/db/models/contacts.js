import { model, Schema } from 'mongoose';

const ContactsSchema = new Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: String, requared: true },
    email: { type: String },
    isFavourite: { type: Boolean, default: false },
    contactType: {
      type: String,
      requared: true,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
    },
  },
  { timestamps: true, versionKey: false },
);

export const ContactsCollection = model('contacts', ContactsSchema);
