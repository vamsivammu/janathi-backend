import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsModule } from 'src/payments/payments.module';
import { SubscriptionViewModule } from 'src/subscription-view/subscription-view.module';
import { UserController } from './controller/user.controller';
import { User } from './models/user.entity';
import { UserService } from './service/user.service';

@Module({
  imports:[PaymentsModule,TypeOrmModule.forFeature([User]), SubscriptionViewModule],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}
