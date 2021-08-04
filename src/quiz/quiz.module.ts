import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswersModule } from 'src/answers/answers.module';
import { AttemptsModule } from 'src/attempts/attempts.module';
import { AuthModule } from 'src/auth/auth.module';
import { ChoicesModule } from 'src/choices/choices.module';
import { QuestionsModule } from 'src/questions/questions.module';
import { S3UploaderService } from 'src/s3-uploader/s3-uploader.service';
import { SubscriptionViewModule } from 'src/subscription-view/subscription-view.module';
import { QuizController } from './controller/quiz.controller';
import { QuizGuard } from './guards/quiz.guard';
import { Quiz } from './models/quiz.entity';
import { QuizService } from './service/quiz.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([Quiz]),
    QuestionsModule,
    AnswersModule,
    AuthModule,
    ChoicesModule,
    AttemptsModule,
    SubscriptionViewModule
  ],
  controllers: [QuizController],
  providers: [QuizService,S3UploaderService,QuizGuard],
  exports:[QuizService]
})
export class QuizModule {}
