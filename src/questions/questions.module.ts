import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './models/question.entity';
import { QuestionsService } from './service/questions.service';
import { QuestionsController } from './controller/questions.controller';
import { AnswersModule } from 'src/answers/answers.module';

@Module({
  imports:[TypeOrmModule.forFeature([Question]),AnswersModule],
  providers: [QuestionsService],
  exports:[QuestionsService],
  controllers: [QuestionsController]
})
export class QuestionsModule {}
