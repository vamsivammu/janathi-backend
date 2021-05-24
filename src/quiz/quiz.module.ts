import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswersModule } from 'src/answers/answers.module';
import { AuthModule } from 'src/auth/auth.module';
import { ChoicesModule } from 'src/choices/choices.module';
import { QuestionsModule } from 'src/questions/questions.module';
import { QuizController } from './controller/quiz.controller';
import { Quiz } from './models/quiz.entity';
import { QuizService } from './service/quiz.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([Quiz]),
    QuestionsModule,
    AnswersModule,
    AuthModule,
    ChoicesModule
  ],
  controllers: [QuizController],
  providers: [QuizService],
  exports:[QuizService]
})
export class QuizModule {}
