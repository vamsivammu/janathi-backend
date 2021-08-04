import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from '../models/video.entity';
import * as crypto from 'crypto';
import { configService } from 'src/config/config.service';
import { NewVideo } from '../dto/NewVideo.dto';
import { Chapter } from 'src/chapters/models/chapter.entity';
import { PaymentsService } from 'src/payments/service/payments.service';
import { planTitles, VideoPlanAccess, VIDEO_PLAN_MAP } from 'src/payments/dto/payment.enum';
import { SubscriptionViewService } from 'src/subscription-view/service/subscription-view.service';

@Injectable()
export class VideosService {
    constructor(
        @InjectRepository(Video)
        private videoRepo:Repository<Video>,
        private subscriptionViewService:SubscriptionViewService,
    ){  }

    async getVideo(id:string){
        try{
            const videoDetails = await this.videoRepo.findOne(id,{relations:['quiz']});
            const videoUrl = this.getSignedUrl(videoDetails.videoStorageId);
            return {...videoDetails,videoUrl};
        }catch(e){
            throw new HttpException('Unknown error occured',HttpStatus.BAD_REQUEST);
        }

    }

    private getSignedUrl(videoId:string){
        const securityKey = configService.getBunnyCdnStream();
        const url = `https://vz-d13118e8-7f8.b-cdn.net/${videoId}/playlist.m3u8`;
        let currSeconds = (new Date()).getTime()/1000;
        let expires = Math.floor(currSeconds) + 3600;
        let hashableBase = securityKey + `/${videoId}/` + expires + `token_path=/${videoId}/`;
        let token = Buffer.from(crypto.createHash("sha256").update(hashableBase).digest()).toString('base64');
        token = token.replace(/\n/g, "").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
        // return `${url}?token=${token}&expires=${expires}&token_path=/${videoId}/`;
        return `https://vz-d13118e8-7f8.b-cdn.net/bcdn_token=${token}&expires=${expires}&token_path=%2F${videoId}%2F/${videoId}/playlist.m3u8`;
    }
    private getCdnAuthUrl(videoId:string){
        var hashableBase = "", token = "";
        const securityKey = configService.getBunnyCdnStream();
        let currSeconds = (new Date()).getTime()/1000;
        let expires = Math.floor(currSeconds) + 3600;
        hashableBase = securityKey + `/embed/${configService.getBunnyCdnVideoLibraryId()}/${videoId}` + expires;
        token = Buffer.from(crypto.createHash("sha256").update(hashableBase).digest()).toString('base64');
        token = token.replace(/\n/g, "").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
        return 'https://iframe.mediadelivery.net/embed/' + configService.getBunnyCdnVideoLibraryId() + "/" + videoId + "?token=" + token + "&expires=" + expires ;
    }
    async createOne(videoDetails:NewVideo, chapter:Chapter){
        const newVideo = this.videoRepo.create();
        newVideo.name = videoDetails.name;
        newVideo.description = videoDetails.description;
        newVideo.videoStorageId = videoDetails.videoStorageId;
        newVideo.isFree = videoDetails.isFree;
        newVideo.chapter = chapter;
        return this.videoRepo.insert(newVideo);
    }

    async getVideoInfo(videoId:string){
        return this.videoRepo.findOneOrFail(videoId,{relations:['chapter']});
    }

    async checkVideoAccess(videoId:string,userId:string){
        const videoInfo = await this.getVideoInfo(videoId);
        if(videoInfo.isFree){
            return true;
        }
        const requiredPlan = VIDEO_PLAN_MAP[videoInfo.chapter.groupId];
        const activeSubscriptions = await this.subscriptionViewService.getActiveSubscription(userId,requiredPlan);
        
        if(activeSubscriptions.length==1){
            return true;
        }
        throw new ForbiddenException(`You need to purchase ${planTitles[requiredPlan]}`);
        
    }
}
