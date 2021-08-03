import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Chapter } from '../models/chapter.entity';
import { GROUPS, INewChapter, IUpdateChapter, VIDEO_GROUPS } from '../models/chapters.interface';

@Injectable()
export class ChaptersService {
    constructor(
        @InjectRepository(Chapter)
        private chapterRepo:Repository<Chapter>
    ){  }

    async findOne(id:string):Promise<Chapter>{
        try{
            const chapter = await this.chapterRepo
            .createQueryBuilder('chapter')
            .leftJoinAndSelect('chapter.videos','video')
            .where('chapter.id = :id',{id})
            .loadRelationCountAndMap('chapter.videoCount','chapter.videos')
            .getOneOrFail();
            chapter.videos.forEach(video=>{
                video.thumbnail = this.getSignedThumbnail(video.videoStorageId);
            })
            return chapter;
        }catch(err){
            throw new HttpException('Module not found',HttpStatus.BAD_REQUEST);
        }
    }

    getSignedThumbnail(videoId:string){
        // var hashableBase = "", token = "";
        // const securityKey = configService.getBunnyCdnStream();
        // let currSeconds = (new Date()).getTime()/1000;
        // let expires = Math.floor(currSeconds) + 3600;
        // hashableBase = securityKey + `/${videoId}/thumbnail.jpg` + expires;
        // token = Buffer.from(crypto.createHash("sha256").update(hashableBase).digest()).toString('hex');
        // token = token.replace(/\n/g, "").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
        // return 'https://vz-d13118e8-7f8.b-cdn.net/bcdn_token='+token+'&expires='+expires+'/'+videoId+'/thumbnail.jpg';
        return `https://vz-d13118e8-7f8.b-cdn.net/${videoId}/thumbnail.jpg`;
    }

    async getChaptersByGroupId(groupId:VIDEO_GROUPS):Promise<Chapter[]>{
        try{
            const chapters = await this.chapterRepo.
            createQueryBuilder('chapter').
            where('chapter.groupId = :groupId',{groupId}).
            loadRelationCountAndMap('chapter.videoCount','chapter.videos').
            getMany();
            return chapters;
        }
        catch(e){
            throw new HttpException('Unknown error occured',HttpStatus.BAD_REQUEST);
        }
    }

    async createOne(chapter){
        const newChapter = {...chapter};
        return this.chapterRepo.createQueryBuilder('chapter').insert().values(newChapter).execute();
    }

    async updateOne(id:string,chapter:IUpdateChapter){
        return this.chapterRepo.update(id,{...chapter});
    }

    async isValidChapter(id:string){
        return this.chapterRepo.findOneOrFail(id);
    }


}
