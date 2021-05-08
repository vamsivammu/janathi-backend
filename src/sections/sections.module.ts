import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { QuizModule } from 'src/quiz/quiz.module';
import { SectionsController } from './controller/sections.controller';
import { Section } from './models/section.entity';
import { SectionsService } from './service/sections.service';

@Module({
  imports:[TypeOrmModule.forFeature([Section]),QuizModule],
  controllers: [SectionsController],
  providers: [SectionsService],
  exports:[SectionsService]
})
export class SectionsModule {}
