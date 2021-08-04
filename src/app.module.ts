import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import {configService} from './config/config.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { QuizModule } from './quiz/quiz.module';
import { QuestionsModule } from './questions/questions.module';
import { AnswersModule } from './answers/answers.module';
import { AttemptsModule } from './attempts/attempts.module';
import { ChaptersModule } from './chapters/chapters.module';
import { VideosModule } from './videos/videos.module';
import { ChoicesModule } from './choices/choices.module';
import { PapersModule } from './papers/papers.module';
import { ResponsesModule } from './responses/responses.module';
import { PaymentsModule } from './payments/payments.module';
import { QuizPdfsModule } from './quiz-pdfs/quiz-pdfs.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { SubscriptionViewModule } from './subscription-view/subscription-view.module';
@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    UserModule,
    AuthModule,
    QuizModule,
    QuestionsModule,
    AnswersModule,
    AttemptsModule,
    ChaptersModule,
    ChoicesModule,
    PapersModule,
    ResponsesModule,
    PaymentsModule,
    VideosModule,
    QuizPdfsModule,
    SubscriptionsModule,
    SubscriptionViewModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
