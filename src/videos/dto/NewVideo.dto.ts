import {IsEmpty, IsNotEmpty, IsUUID} from 'class-validator';
export class NewVideo{
    @IsNotEmpty()
    name:string;

    @IsNotEmpty()
    description:string;

    @IsNotEmpty()
    isFree:boolean;

    @IsNotEmpty()
    @IsUUID()
    chapterId:string;

    
    videoStorageId?:string;

}