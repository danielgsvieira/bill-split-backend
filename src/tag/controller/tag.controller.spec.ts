import { TagController } from './teg.controller';
import { TagService } from '../service/tag.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('TagController', () => {
  let controller: TagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [TagService],
    }).compile();

    controller = module.get<TagController>(TagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
