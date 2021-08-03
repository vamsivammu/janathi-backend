import {IsEnum} from 'class-validator';
import { VIDEO_GROUPS } from '../models/chapters.interface';
export class GetChaptersDto{
    @IsEnum(VIDEO_GROUPS)
    groupId:VIDEO_GROUPS;
}