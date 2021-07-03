import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsModule } from 'src/questions/questions.module';
import { Response } from './models/response.entity';
import { ResponsesService } from './service/responses.service';

@Module({
  providers: [ResponsesService],
  imports:[TypeOrmModule.forFeature([Response]),QuestionsModule],
  exports:[ResponsesService]

})
export class ResponsesModule {}
