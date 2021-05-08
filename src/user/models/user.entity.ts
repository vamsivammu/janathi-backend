import { Attempt } from 'src/attempts/models/attempt.entity';
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

    @Column({
        type:'enum',
        enum:UserRole,
        default:UserRole.USER
    })
    role:UserRole;

    @OneToMany(()=>Attempt,(attempt:Attempt)=>attempt.user)
    attempts:Attempt[];

    
}