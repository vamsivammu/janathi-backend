import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserRole } from "src/user/models/user.interface";
import { UserService } from "src/user/service/user.service";
import { IUserBody } from "../models/auth.interface";
import {ROLE_PRIORITIES} from '../../constants'
@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector:Reflector){   }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<UserRole>('roles',context.getHandler());
        
        if(!roles){
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user:IUserBody = request.user;
        if(this.checkRoles(roles,user.role)){
            return true;
        }
        throw new UnauthorizedException('You are not authorized to do this operation');
    }

    checkRoles(routeRoles:UserRole,userRoles:UserRole){
        return ROLE_PRIORITIES[userRoles]>=ROLE_PRIORITIES[routeRoles];
    }
    
}