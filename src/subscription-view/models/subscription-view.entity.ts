import { Plans } from "src/payments/dto/payment.enum";
import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({expression:`
    select "subscription"."startTimestamp" as "startTimestamp","subscription"."endTimestamp" as "endTimestamp", "subscription"."userId" as "userId",
    "payment"."subscription" as "planId" from "subscription" left join "payment" on "payment"."sessionId" = "subscription"."paymentId"
`, materialized:true,synchronize:true,name:'subscription_view'})
export class SubscriptionView{
    @ViewColumn()
    startTimestamp:Date;

    @ViewColumn()
    endTimestamp:Date;

    @ViewColumn()
    userId:string;

    @ViewColumn()
    planId:Plans;

}