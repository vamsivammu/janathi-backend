import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentsService } from 'src/payments/service/payments.service';
import { Repository } from 'typeorm';
import { User } from '../models/user.entity';
import { IUser } from '../models/user.interface';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository:Repository<User>,
        @Inject(forwardRef(()=>PaymentsService))
        private paymentsService:PaymentsService
    ){  }

    async findOne(id:string):Promise<IUser>{
        const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id',{id})
        .getOne();
        user.payments = await this.paymentsService.getActiveSubscriptionDetails(user.id);
        return user;
    }

    create(user:IUser):Promise<IUser>{
        return this.userRepository.save(user);
    }

    updateOne(id:string,user:IUser):Promise<any>{
        return this.userRepository.update({id},user);
    }

    findAll():Promise<IUser[]>{
        return this.userRepository.find();
    }

    async findOneByEmail(email:string):Promise<User>{
        try{
            const userData = await this.userRepository.findOneOrFail({email},{select:["id","email","mobile","password","role","name"]})
            return userData;
        }
        catch(err){
            throw new BadRequestException("Email not registered");
        }
    }

    async findByEmailOrMobile(email:string,mobile:string):Promise<boolean>{
        try{
            await this.userRepository.createQueryBuilder('user')
                .where("user.email = :email",{email})
                .orWhere("user.mobile = :mobile",{mobile})
                .getOneOrFail()
            return true;
        }
        catch(err){
            return false;
        }
    }

    
}
