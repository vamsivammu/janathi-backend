import { Test, TestingModule } from '@nestjs/testing';
import { QuizPdfsController } from './quiz-pdfs.controller';

describe('QuizPdfsController', () => {
  let controller: QuizPdfsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizPdfsController],
    }).compile();

    controller = module.get<QuizPdfsController>(QuizPdfsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
