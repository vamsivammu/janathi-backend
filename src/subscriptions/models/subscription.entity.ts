import { Plans } from "src/payments/dto/payment.enum";
import { Payment } from "src/payments/models/payment.entity";
import { User } from "src/user/models/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Subscription{
    
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({type:'timestamptz',update:false})
    startTimestamp:Date;

    @Column({type:'timestamptz',update:false})
    endTimestamp:Date;

    @ManyToOne(()=>User,(user:User)=>user.subscriptions)
    @JoinColumn()
    user:User;

    @Column({update:false})
    userId:string;
    
    @OneToOne(()=>Payment,(payment:Payment)=>payment.activeSubscription)
    @JoinColumn({name:'paymentId',referencedColumnName:'sessionId'})
    payment:Payment;

    @Column({update:false})
    paymentId:string;

}