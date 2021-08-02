import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './models/question.entity';
import { QuestionsService } from './service/questions.service';
import { QuestionsController } from './controller/questions.controller';
import { AnswersModule } from 'src/answers/answers.module';
import { S3UploaderService } from 'src/s3-uploader/s3-uploader.service';
import { ChoicesModule } from 'src/choices/choices.module';

@Module({
  imports:[TypeOrmModule.forFeature([Question]),AnswersModule,ChoicesModule],
  providers: [QuestionsService,S3UploaderService],
  exports:[QuestionsService],
  controllers: [QuestionsController]
})
export class QuestionsModule {}
