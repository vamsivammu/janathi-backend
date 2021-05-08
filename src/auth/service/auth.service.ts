import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/service/user.service';
import { IUserAuthentication, IUserBody, IUserSignup } from '../models/auth.interface';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/models/user.entity';
import { configService } from 'src/config/config.service';

@Injectable()
export class AuthService {
    constructor(private userService:UserService,private jwtService:JwtService){   }

    async signin(user:IUserAuthentication):Promise<{access_token:string,refresh_token:string}>{
        const userData = await this.userService.findOneByEmail(user.email);
        const passwordsMatch = await this.comparePasswords(user.password,userData.password);
        if(!passwordsMatch){
            throw new UnauthorizedException("Invalid Password")
        }
        const {password,mobile,...payload} = userData;
        const access_token = await this.generateJwtAccess(payload);
        const refresh_token = await this.generateJwtRefresh(payload);
        return {access_token,refresh_token};
    }
    hashPassword(password:string,salt:string):Promise<string>{
        return bcrypt.hash(password,salt);
    }

    comparePasswords(password:string,hashedPassword:string):Promise<boolean>{
        return bcrypt.compare(password,hashedPassword);
    }

    generateJwtAccess(user:IUserBody):Promise<string>{
        return this.jwtService.signAsync(user,{secret:configService.getJwtConfig()});
    }

    generateJwtRefresh(user:IUserBody):Promise<string>{
        return this.jwtService.signAsync(user,{secret:configService.getJwtRefresh()});
    }

    verifyRefreshJwt(token:string){
        return this.jwtService.verifyAsync(token,{secret:configService.getJwtRefresh()});
    }

    async signup(user:IUserSignup):Promise<{access_token:string,refresh_token:string}>{
        const isAlreadyRegistered = await this.userService.findByEmailOrMobile(user.email,user.mobile);
        if(isAlreadyRegistered){
            throw new BadRequestException('User already exists');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await this.hashPassword(user.password,salt);
        const newUser = new User();
        newUser.email = user.email;
        newUser.mobile = user.mobile;
        newUser.name = user.name;
        newUser.password = hashedPassword;
        const userData = await this.userService.create(newUser);
        const {mobile,password,...payload} = userData;
        const access_token = await this.generateJwtAccess(payload);
        const refresh_token = await this.generateJwtRefresh(payload);
        return {access_token,refresh_token};
    }

}
