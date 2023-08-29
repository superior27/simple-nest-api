import { FileService } from "../../file/file.service";


export const fileServiceMock = {
  provide: FileService,
  useValue: {
    storage: jest.fn().mockResolvedValue(''),
    
  },
};