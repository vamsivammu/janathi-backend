import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsController } from './controller/subscriptions.controller';
import { Subscription } from './models/subscription.entity';
import { SubscriptionsService } from './service/subscriptions.service';

@Module({
  imports:[TypeOrmModule.forFeature([Subscription])],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports:[SubscriptionsService]
})
export class SubscriptionsModule {}
