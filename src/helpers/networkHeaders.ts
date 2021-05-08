import { AxiosRequestConfig } from "axios"
import { configService } from "src/config/config.service"

export const BUNNY_CDN_EDGE_HEADERS:AxiosRequestConfig = {
    headers:{
        'AccessKey':configService.getBunnyCdnStorage()
    }
}

export const BUNNY_CDN_VIDEO_CREATE_HEADERS:AxiosRequestConfig = {
    headers:{
        'AccessKey':configService.getBunnyCdnVideo(),
    }
}


export const BUNNY_CDN_VIDEO_UPLOAD_HEADERS:AxiosRequestConfig = {
    headers:{
        'AccessKey':configService.getBunnyCdnVideo(),
        'Content-Type':'application/octet-stream'
    },
    maxBodyLength:Infinity,
    maxContentLength:Infinity,
}

