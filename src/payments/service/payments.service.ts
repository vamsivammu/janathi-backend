import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GROUPS, VIDEO_GROUPS } from 'src/chapters/models/chapters.interface';
import { configService } from 'src/config/config.service';
import { SubscriptionsService } from 'src/subscriptions/service/subscriptions.service';
import { UserService } from 'src/user/service/user.service';
import {Stripe} from 'stripe';
import { getManager, Repository } from 'typeorm';
import { planPrices, Plans, planTitles, VIDEO_PLAN_MAP } from '../dto/payment.enum';
import { Payment } from '../models/payment.entity';

@Injectable()
export class PaymentsService {
    stripe:Stripe;
    constructor(
        private userService:UserService,
        @InjectRepository(Payment)
        private paymentRepo:Repository<Payment>,
        private subscriptionsService:SubscriptionsService
    ){
        this.stripe = new Stripe(configService.getStripeTestSecret(),{typescript:true,apiVersion:null});
    }

    async initPayment(userId:string,subscription:Plans){
        const prevPayments = await this.getPrevPayments(userId,subscription);
        // console.log(prevPayments);
        if(prevPayments.length>0){
            throw new BadRequestException('Already purchased');
        }
        return this.createSession(userId,subscription);    
    }

    async createSession(userId:string,subscription:Plans){
        const userData = await this.userService.findOne(userId);
        const params:Stripe.Checkout.SessionCreateParams = {
            success_url:`${configService.getStripeRedirectUrl()}/paymentStatus?success=true`,
            cancel_url:`${configService.getStripeRedirectUrl()}/paymentStatus?failure=true`,
            mode:'payment',
            customer_email:userData.email,
            line_items:[
                {
                    price_data:{
                        currency:'INR',
                        unit_amount:planPrices[subscription].price*100,
                        product_data:{
                            name:planTitles[subscription],
                        },
                    },
                    quantity:1,
                }
            ],
            payment_method_types:['card']
        };
        const resp = await this.stripe.checkout.sessions.create(params);
        await this.insertPayment(resp.payment_intent.toString(),userId,subscription);
        return {sessionId:resp.id};
    }

    async updatePaymentSuccess(sessionId:string){
        const paymentData = await this.paymentRepo.findOne({sessionId});
        this.paymentRepo.update({sessionId},{success:true,pending:false,active:true});
        this.subscriptionsService.insertSubscription(paymentData);
    }

    async updatePaymentFailure(sessionId:string){
        this.paymentRepo.update({sessionId},{success:false,pending:false,active:false});
    }

    updatePaymentInactive(sessionIds:string[]){
        this.paymentRepo
        .createQueryBuilder('payment')
        .update()
        .set({active:false})
        .where('sessionId IN (:sessionIds)',{sessionIds})
        .execute();
    }

    insertPayment(sessionId:string,userId:string,subscription:Plans){
        const payment = new Payment();
        payment.userId = userId;
        payment.sessionId = sessionId;
        payment.subscription = subscription;
        this.paymentRepo.insert(payment);
    }

    deletePayment(sessionId:string){

    }

    async getPrevPayments(userId:string,subscription:Plans){
        const currDate = new Date();
        const prevPlans = await getManager().query(`select * from "subscription_view" where "userId"=$1 and "planId"=$2 and "endTimestamp" > $3`,[userId,subscription,currDate]);
        return prevPlans;
    }

    handleWebhook(event:any){
        switch (event.type) {
            case 'payment_intent.succeeded':
              const paymentIntent:Stripe.PaymentIntent = event.data.object;
              this.updatePaymentSuccess(paymentIntent.id);
              console.log('PaymentIntent was successful!',paymentIntent);
              return;
            case 'payment_intent.payment_failed':
              const paymentIntentFailed = event.data.object;
              this.updatePaymentFailure(paymentIntentFailed.id);
              return;
            // ... handle other event types
            case 'payment_intent.canceled':
                const paymentIntentCanceled = event.data.object;
                this.deletePayment(paymentIntentCanceled.id);
                return;
            default:
              console.log(`Unhandled event type ${event.type}`);
        }

    }

}