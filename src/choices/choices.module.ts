import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChoicesController } from './controller/choices.controller';
import { Choice } from './models/choice.entity';
import { ChoicesService } from './service/choices.service';

@Module({
  imports:[TypeOrmModule.forFeature([Choice])],
  controllers: [ChoicesController],
  providers: [ChoicesService],
  exports:[ChoicesService]
})
export class ChoicesModule {}
