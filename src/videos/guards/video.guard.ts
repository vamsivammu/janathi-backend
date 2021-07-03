import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Observable } from "rxjs";
import { UserRole } from "src/user/models/user.interface";
import { VideosService } from "../service/videos.service";
@Injectable()
export class VideoGuard implements CanActivate{
    constructor(private videoService:VideosService){   }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request:Request = context.switchToHttp().getRequest();
        const userId = request.user['id'];
        if(request.user['role'] == UserRole.ADMIN){
            return true;
        }
        return this.videoService.checkVideoAccess(request.params['videoId'],userId);        
    }
    
}