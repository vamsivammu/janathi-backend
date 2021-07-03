import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { PaymentsController } from './controller/payments.controller';
import { Payment } from './models/payment.entity';
import { PaymentsService } from './service/payments.service';

@Module({
  imports:[TypeOrmModule.forFeature([Payment]),UserModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports:[PaymentsService]
})
export class PaymentsModule {}
