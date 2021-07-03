export const ROLE_PRIORITIES = {
    ADMIN:4,
    GOLD:3,
    SILVER:2,
    BRONZE:1,
    USER:0
}

export const IMAGE_UPLOAD = (id:string,ext:string)=>`https://sg.storage.bunnycdn.com/mandroo-thumbnails/${id}.${ext}`
export const CREATE_VIDEO = 'https://video.bunnycdn.com/library/7978/videos';
export const VIDEO_UPLOAD = (id:string) => `${CREATE_VIDEO}/${id}`;