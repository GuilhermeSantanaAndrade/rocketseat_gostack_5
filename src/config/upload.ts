import multer from 'multer';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const dir = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: dir,
  storage: multer.diskStorage({
    destination: dir,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    }
  }),

};