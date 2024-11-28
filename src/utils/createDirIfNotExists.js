import fs from 'node:fs/promises';

export const createDirIfNotExists = async (url) => {
  try {
    await fs.access(url);
  } catch (error) {
    console.log(error.code, 'err code, create the dir');
    if (error.code === 'ENOENT') {
      await fs.mkdir(url);
    }
  }
};
