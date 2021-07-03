import { Injectable } from '@nestjs/common';
import {S3} from 'aws-sdk';
import { configService } from 'src/config/config.service';
import * as resizeImg from 'resize-image-buffer';

@Injectable()
export class S3UploaderService {
    s3:S3;
    constructor(){
        this.s3 = new S3(configService.getAwsS3Config());
    }
    async uploadFile(file:Express.Multer.File,name:string,ext:string){
        const params:S3.PutObjectRequest = {
            Bucket:'janathi-images',
            Key:`${name}.${ext}`,
            Body:file.buffer,
            ContentType:`image/${ext}`
        };
        const response = await this.s3.upload(params).promise();
        return response;
    }

    async uploadChoiceImages(files:Express.Multer.File[],choiceIds:string[],extensions:string[]){
        await this.uploadFile(files[0],choiceIds[0],extensions[0]);
        await this.uploadFile(files[1],choiceIds[1],extensions[1]);
        await this.uploadFile(files[2],choiceIds[2],extensions[2]);
        await this.uploadFile(files[3],choiceIds[3],extensions[3]);
    }

    async uploadQuizPdf(file:Express.Multer.File,name:string){
        const params = {
            Bucket:'janathi-images',
            Key:`${name}.pdf`,
            Body:file.buffer,
            ContentType:'application/pdf'
        };
        const resp = await this.s3.upload(params).promise();
        return resp;
    }

    async uploadChapterImage(file:Express.Multer.File,name:string,ext:string){        
        const smallImg = await resizeImg(file.buffer,{width:16,height:9});
        const params1 = {
            Bucket:'janathi-images',
            Key:`${name}.${ext}`,
            Body:file.buffer,
            ContentType:`image/${ext}`
        };
        const params2 = {
            ...params1,
            Body:smallImg,
            Key:`${name}_small.${ext}`
        };
        await this.s3.upload(params1).promise();
        await this.s3.upload(params2).promise();
    }

}
