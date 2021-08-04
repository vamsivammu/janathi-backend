import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionView } from './models/subscription-view.entity';
import { SubscriptionViewService } from './service/subscription-view.service';

@Module({
  imports:[TypeOrmModule.forFeature([SubscriptionView])],
  providers: [SubscriptionViewService],
  exports:[SubscriptionViewService]
})
export class SubscriptionViewModule {}
