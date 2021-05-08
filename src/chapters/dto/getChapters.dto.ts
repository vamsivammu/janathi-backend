import {IsEnum} from 'class-validator';
import { GROUPS } from '../models/chapters.interface';
export class GetChaptersDto{
    @IsEnum(GROUPS)
    groupId:GROUPS;
}