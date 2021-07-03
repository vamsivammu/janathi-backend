import { Body, Controller, HttpException, HttpStatus, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { IUserAuthentication, IUserSignup } from '../models/auth.interface';
import { AuthService } from '../service/auth.service';
import {map} from 'rxjs/operators'
import { Request, Response } from 'express';
@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){   }

    @Post('signin')
    signin(@Body() user:IUserAuthentication, @Res({passthrough:true}) res:Response):Observable<{access_token:string}>{
        return from(this.authService.signin(user)).pipe(map(({access_token,refresh_token})=>{
            res.cookie('jid',refresh_token,{httpOnly:true,maxAge:8640000*1000,path:'/auth/refresh',sameSite:'lax'});
            return {access_token};
        }))
    }

    @Post('signup')
    signup(@Body() user:IUserSignup, @Res({passthrough:true}) res:Response):Observable<{access_token:string}>{
        return from(this.authService.signup(user)).pipe(map(({access_token,refresh_token})=>{
            res.cookie('jid',refresh_token,{httpOnly:true,maxAge:8640000*1000,path:'/auth/refresh',sameSite:'lax'});
            return {access_token};
        }))
    }

    @Post('refresh')
    async refreshToken(@Req() req:Request,@Res({passthrough:true}) res:Response):Promise<{access_token:string}>{
        const jid = req.cookies['jid'];
        if(!jid){
            throw new HttpException('New User',HttpStatus.NOT_ACCEPTABLE)
        }
        try{
            const payload = await this.authService.verifyRefreshJwt(jid);
            const {iat,exp,...rest} = payload;
            const access_token = await this.authService.generateJwtAccess(rest);
            return {access_token};
        }catch(e){
            res.cookie('jid',null,{httpOnly:true,maxAge:0,sameSite:'lax',path:'/auth/refresh'});
            throw new UnauthorizedException('Your session is expired');
        }
    }

    @Post('logout')
    async logout(@Res({passthrough:true}) res:Response){
        res.cookie('jid',null,{httpOnly:true,maxAge:0,sameSite:'lax',path:'/auth/refresh'});
        
    }
}
