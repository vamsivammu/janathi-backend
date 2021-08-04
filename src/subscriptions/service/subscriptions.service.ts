import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { planPrices } from 'src/payments/dto/payment.enum';
import { Payment } from 'src/payments/models/payment.entity';
import { Repository } from 'typeorm';
import { Subscription } from '../models/subscription.entity';

@Injectable()
export class SubscriptionsService {

    constructor(
        @InjectRepository(Subscription)
        private subscriptionRepository:Repository<Subscription>
    ){  }

    insertSubscription(payment:Payment){
        if(payment && payment.sessionId && payment.pending){
            const subscription = new Subscription();
            subscription.paymentId = payment.sessionId;
            subscription.startTimestamp = new Date();
            subscription.userId = payment.userId;
            const durationDays = planPrices[payment.subscription].period=='Year'?365:31;
            subscription.endTimestamp = new Date(subscription.startTimestamp.getTime() + durationDays*86400*1000);
            this.subscriptionRepository.insert(subscription);
        }
    }

}
