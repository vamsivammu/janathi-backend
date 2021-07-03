import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3UploaderService } from 'src/s3-uploader/s3-uploader.service';
import { QuizPdfsController } from './controller/quiz-pdfs.controller';
import { QuizPdfs } from './models/quiz-pdfs.entity';
import { QuizPdfsService } from './service/quiz-pdfs.service';

@Module({
  imports:[TypeOrmModule.forFeature([QuizPdfs])],
  controllers: [QuizPdfsController],
  providers: [QuizPdfsService,S3UploaderService],
  exports:[QuizPdfsService]
})
export class QuizPdfsModule {}
