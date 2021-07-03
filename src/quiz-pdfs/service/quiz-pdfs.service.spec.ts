import { Test, TestingModule } from '@nestjs/testing';
import { QuizPdfsService } from './quiz-pdfs.service';

describe('QuizPdfsService', () => {
  let service: QuizPdfsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizPdfsService],
    }).compile();

    service = module.get<QuizPdfsService>(QuizPdfsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
