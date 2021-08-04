import { Injectable } from '@nestjs/common';
import { Plans } from 'src/payments/dto/payment.enum';
// import {} from '@nestjs/typeorm';
import {getManager} from 'typeorm';
@Injectable()
export class SubscriptionViewService {
    
    async getActiveSubscription(userId:string,planId:Plans){
        console.log("getting subscriptions")
        const currDate = new Date();
        const subscriptions = await getManager().query(`select * from "subscription_view" where "userId"=$1 and "planId"=$2 and "endTimestamp" > $3`,[userId,planId,currDate]);
        return subscriptions;
    }
    async getActiveSubscriptionDetails(userId:string){
        const currDate = new Date();
        const subscriptions = await getManager().query(`select * from "subscription_view" where "userId"=$1 and "endTimestamp" > $2`,[userId,currDate]);
        return subscriptions;
    }
}
