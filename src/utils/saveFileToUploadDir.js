import path from 'node:path';
import fs from 'node:fs/promises';

import { UPLOAD_DIR, TEMP_UPLOAD_DIR } from '../constants/index.js';
import { env } from './env.js';

export const saveFileToUploadDir = async (file) => {
  await fs.rename(
    path.join(TEMP_UPLOAD_DIR, file.filename),
    path.join(UPLOAD_DIR, file.filename),
  );

  console.log(file, 'file in save file to uploads dir');

  return `${env('APP_DOMAIN')}/uploads/${file.filename}`;
};
