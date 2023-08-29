import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class FileService {

    async storage(file: Express.Multer.File): Promise<string>
    {
        const fileName = randomUUID({disableEntropyCache : true})+ '-' + new Date().getTime();
        const ext = file.mimetype.split('/')[1];
        const path = join(__dirname, '..', '..', 'storage', 'images', `${fileName}.${ext}`);
        await writeFile(path, file.buffer);
        return path;
    }

}
