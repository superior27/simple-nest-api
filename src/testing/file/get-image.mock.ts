import { join } from 'path';
import { getFileToBuffer } from './get-file-to-buffer';

export const getImage = async () => {
  const { buffer, stream } = await getFileToBuffer(
    join(__dirname, 'image.jpeg'),
  );

  const image: Express.Multer.File = {
    fieldname: 'file',
    originalname: 'image.jpeg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1 * 1024 * 1024,
    stream: stream,
    destination: '',
    filename: 'file-name',
    path: 'file-path',
    buffer: buffer,
  };

  return image;
};
