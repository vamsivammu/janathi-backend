import { SharedProps } from "src/helpers/sharedProps.helper";
import { Subscription } from "src/subscriptions/models/subscription.entity";
import { User } from "src/user/models/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { Plans } from "../dto/payment.enum";

@Entity()
export class Payment extends SharedProps{

    @PrimaryColumn()
    sessionId:string;

    @Column({default:false})
    success:boolean;

    @Column({default:true})
    pending:boolean;

    @Column()
    subscription:Plans;

    @Column({default:999})
    amount:number;

    @ManyToOne(()=>User,(user:User)=>user.payments)
    @JoinColumn()
    user:User;

    @Column()
    userId:string;

    @Column({default:false})
    active:boolean;

    @OneToOne(()=>Subscription,(subscription:Subscription)=>subscription.payment)
    activeSubscription:Subscription;

    
}