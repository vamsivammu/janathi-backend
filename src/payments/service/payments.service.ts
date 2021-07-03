import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { configService } from 'src/config/config.service';
import { UserService } from 'src/user/service/user.service';
import {Stripe} from 'stripe';
import { Repository } from 'typeorm';
import { Plans } from '../dto/payment.enum';
import { Payment } from '../models/payment.entity';

@Injectable()
export class PaymentsService {
    stripe:Stripe;
    constructor(
        private userService:UserService,
        @InjectRepository(Payment)
        private paymentRepo:Repository<Payment>
    ){
        this.stripe = new Stripe(configService.getStripeTestSecret(),{typescript:true,apiVersion:null});
    }

    async initPayment(userId:string,subscription:Plans){
        const prevPayments = await this.getPrevPayments(userId,subscription);
        console.log(prevPayments);
        if(prevPayments){
            throw new BadRequestException('Already purchased');
        }
        return this.createSession(userId,subscription);    
    }

     async createSession(userId:string,subscription:Plans){
        const userData = await this.userService.findOne(userId);
        const params:Stripe.Checkout.SessionCreateParams = {
            success_url:`http://localhost:3000/paymentStatus?success=true`,
            cancel_url:`http://localhost:3000/paymentStatus?failure=true`,
            mode:'payment',
            customer_email:userData.email,
            line_items:[
                {
                    price_data:{
                        currency:'INR',
                        unit_amount:99900,
                        product_data:{
                            name:subscription,
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

     updatePaymentSuccess(sessionId:string){
        this.paymentRepo.update({sessionId},{success:true,pending:false,active:true});
    }

     updatePaymentFailure(sessionId:string){
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

     getPrevPayments(userId:string,subscription:Plans){
        return this.paymentRepo
                .createQueryBuilder('payment')
                .where('payment.userId = :userId',{userId})
                .andWhere('payment.subscription = :subscription',{subscription})
                .andWhere('payment.active = TRUE')
                .getOne();
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

    async getActiveSubscriptions(userId:string){
        const payments = await this.paymentRepo
                                .createQueryBuilder('payment')
                                .where('payment.userId = :userId',{userId})
                                .andWhere('payment.active = TRUE')
                                .getMany();
        
    
        const expiredIds = [];
        const activePayments = [];
        payments.forEach(payment=>{
            const tim = new Date().getTime() - new Date(payment.updated_at).getTime();
            if(tim/(86400*1000) > 30){
                expiredIds.push(payment.sessionId);
            }else{
                activePayments.push(payment.subscription);
            }
        });
        console.log(expiredIds);
        if(expiredIds.length>0){
            this.updatePaymentInactive(expiredIds);        
        }   
        return activePayments;
    }

}