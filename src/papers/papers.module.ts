import { Module } from '@nestjs/common';
import { PapersController } from './controller/papers.controller';
import { PapersService } from './service/papers.service';

@Module({
  controllers: [PapersController],
  providers: [PapersService]
})
export class PapersModule {}
