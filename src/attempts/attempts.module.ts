import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attempt } from './models/attempt.entity';
import { AttemptsService } from './service/attempts.service';
import { AttemptsController } from './controller/attempts.controller';
import { AnswersModule } from 'src/answers/answers.module';
import { ResponsesModule } from 'src/responses/responses.module';
import { AuthModule } from 'src/auth/auth.module';
import { QuizPdfsModule } from 'src/quiz-pdfs/quiz-pdfs.module';

@Module({
  imports:[TypeOrmModule.forFeature([Attempt]),AnswersModule,ResponsesModule,AuthModule,QuizPdfsModule],
  providers: [AttemptsService],
  exports:[AttemptsService],
  controllers: [AttemptsController]
})
export class AttemptsModule {}
