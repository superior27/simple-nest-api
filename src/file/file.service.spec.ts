import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import { getImage } from '../testing/file/get-image.mock';

// npm test src/file/file.service.spec.ts
describe('FileService', () => {
  let service: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upload image', () => {
    it('shold be upload a file', async () => {
      const image = await getImage();
      service.storage(image);
    });
  });
});
