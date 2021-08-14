import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/service/user.service';
import { IUserAuthentication, IUserBody, IUserSignup } from '../models/auth.interface';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/models/user.entity';
import { configService } from 'src/config/config.service';
import * as nodemailer from 'nodemailer';
import { UserRole } from 'src/user/models/user.interface';
@Injectable()
export class AuthService {
    transport:any;
    constructor(private userService:UserService,private jwtService:JwtService){ 
        this.transport = nodemailer.createTransport({
            service:'gmail',
            auth:{
              user:'janathiacademy@gmail.com',
              pass:'Janathi@99'
            }
        })
    }

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

    async generateResetLink(email:string){
        const userData = await this.userService.findOneByEmail(email);
        const {id,...rest} = userData;
        const hash = await bcrypt.hash(id+email,10);
        await this.userService.updateResetHash(email,hash);
        let link = `${configService.getStripeRedirectUrl()}/reset-password/${hash}`;
        if(userData.role==UserRole.ADMIN){
            link = `https://admin.mandrooacademy.com/reset-password/${hash}`;
        }
        this.sendResetEmail(email,link);
    }

    async sendResetEmail(email:string,link:string){
        var opts = {
            from:'Mandroo Academy',
            to:email.trim(),
            subject:'Reset password link',
            text:`Click on the link to reset your password. ${link}`
        }
        this.transport.sendMail(opts,(err,info)=>{
            if(err){
                console.log(err);     
            }else{
                console.log(info)
                console.log("Email sent")
            }
        })
    }

    async resetPassword(hash:string,password:string){
        const hashedPassword = await bcrypt.hash(password,10);
        const updatedResponse = await this.userService.resetPassword(hash,hashedPassword);
        // console.log(updatedResponse.affected)
        if(!updatedResponse.affected){
            throw new BadRequestException("The reset link has been expired")
        }
    }


}
