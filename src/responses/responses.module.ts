import { Module } from '@nestjs/common';
import { ResponsesService } from './service/responses.service';

@Module({
  providers: [ResponsesService]
})
export class ResponsesModule {}
