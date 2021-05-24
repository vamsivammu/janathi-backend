import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attempt } from './models/attempt.entity';
import { AttemptsService } from './service/attempts.service';
import { AttemptsController } from './controller/attempts.controller';

@Module({
  imports:[TypeOrmModule.forFeature([Attempt])],
  providers: [AttemptsService],
  exports:[AttemptsService],
  controllers: [AttemptsController]
})
export class AttemptsModule {}
