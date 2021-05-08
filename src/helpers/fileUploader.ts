import axios from 'axios';
import { CREATE_VIDEO, IMAGE_UPLOAD, VIDEO_UPLOAD } from 'src/constants';
import * as resizeImg from 'resize-image-buffer';
import { ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { BUNNY_CDN_EDGE_HEADERS, BUNNY_CDN_VIDEO_CREATE_HEADERS, BUNNY_CDN_VIDEO_UPLOAD_HEADERS } from './networkHeaders';
export const uploadImage = async(img:Express.Multer.File,id:string)=>{
    try{
        let ext = 'jpg';
        const smallImg = await resizeImg(img.buffer,{width:16,height:9});
        const origImgReq = axios.put(IMAGE_UPLOAD(id,ext),img.buffer,BUNNY_CDN_EDGE_HEADERS);
        const smallImgReq = axios.put(IMAGE_UPLOAD(`${id}_small`,ext),smallImg,BUNNY_CDN_EDGE_HEADERS);
        await Promise.all([origImgReq,smallImgReq]);
    }catch(e){
        throw new HttpException('Error uploading the image',HttpStatus.BAD_REQUEST);
    }
}

export const uploadVideo = async(video:Express.Multer.File,title:string)=>{
    try{
        if(video.mimetype=='video/mp4'){
            const newVideoObject = await axios.post(CREATE_VIDEO,{title},BUNNY_CDN_VIDEO_CREATE_HEADERS);
            const videoUploadResp = await axios.put(VIDEO_UPLOAD(newVideoObject.data.guid),video.buffer,BUNNY_CDN_VIDEO_UPLOAD_HEADERS);
            return newVideoObject.data.guid;
        }else{
            throw new ForbiddenException();
        }
    }catch(e){
        if(e.response){
            console.log(e.response.data,e.response.status);
        }
        throw new HttpException('Error uploading the image',HttpStatus.BAD_REQUEST);
    }
}