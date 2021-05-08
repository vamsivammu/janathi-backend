import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './models/answer.entity';
import { AnswersService } from './service/answers.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([Answer])
  ],
  providers: [AnswersService],
  exports:[AnswersService]
})
export class AnswersModule {}
