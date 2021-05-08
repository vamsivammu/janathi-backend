import {IsUUID} from 'class-validator';
export class GetVideosDto{
    @IsUUID()
    id:string;
}