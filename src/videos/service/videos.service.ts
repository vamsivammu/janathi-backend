import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from '../models/video.entity';
import * as crypto from 'crypto';
import { configService } from 'src/config/config.service';
import { NewVideo } from '../dto/NewVideo.dto';
import { Chapter } from 'src/chapters/models/chapter.entity';
@Injectable()
export class VideosService {
    constructor(
        @InjectRepository(Video)
        private videoRepo:Repository<Video>
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
        const url = `https://iframe.mediadelivery.net/embed/2042/${videoId}`;
        let hashableBase = "";
        let token = "";
        let currSeconds = (new Date()).getTime()/1000;
        let expires = Math.floor(currSeconds) + 3600;
        hashableBase = securityKey + videoId + expires;
        token = crypto.createHash("sha256").update(hashableBase).digest('hex');
        return url + "?token=" + token + "&expires=" + expires;
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
}
