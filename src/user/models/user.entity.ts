import { Attempt } from 'src/attempts/models/attempt.entity';
import { Payment } from 'src/payments/models/payment.entity';
import { SubscriptionView } from 'src/subscription-view/models/subscription-view.entity';
import { Subscription } from 'src/subscriptions/models/subscription.entity';
import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { UserRole } from './user.interface';

@Entity()
export class User{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name:string;

    @Column({unique:true})
    email:string;

    @Column({unique:true})
    mobile:string;

    @Column({select:false})
    password:string;

    @Column({select:false,nullable:true})
    resetHash:string;

    @Column({
        type:'enum',
        enum:UserRole,
        default:UserRole.USER
    })
    role:UserRole;

    @OneToMany(()=>Attempt,(attempt:Attempt)=>attempt.user)
    attempts:Attempt[];

    @OneToMany(()=>Payment,(payment:Payment)=>payment.user)
    payments:Payment[];

    @OneToMany(()=>Subscription,(subscription:Subscription)=>subscription.user)
    subscriptions:Subscription[];
    
    subscriptionInfos:SubscriptionView[];
}