import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { uploadImage } from 'src/helpers/fileUploader';
import { S3UploaderService } from 'src/s3-uploader/s3-uploader.service';
import { UserRole } from 'src/user/models/user.interface';
import { GetChaptersDto } from '../dto/getChapters.dto';
import { GetVideosDto } from '../dto/getVideos.dto';
import { Chapter } from '../models/chapter.entity';
import { INewChapter, IUpdateChapter } from '../models/chapters.interface';
import { ChaptersService } from '../service/chapters.service';


@UseGuards(JwtGuard,RolesGuard)
@Controller('chapters')
export class ChaptersController {

    constructor(
        private chaptersService:ChaptersService,
        private s3UploaderService:S3UploaderService
    ){  }

    @Post()
    @Roles(UserRole.ADMIN)
    @UseInterceptors(FileInterceptor('img'))
    async createOne(@UploadedFile() img:Express.Multer.File, @Body() chapter:INewChapter){
        try{
            const arr = img.originalname.split('.');
            const ext = arr[arr.length - 1];
            const newChapter = await this.chaptersService.createOne({...chapter,imgExt:ext});
            const id = newChapter.identifiers[0].id;
            await this.s3UploaderService.uploadChapterImage(img,id,ext);
            return newChapter;
        }catch(e){
            throw new HttpException('Unknown error occured',HttpStatus.BAD_REQUEST);
        }
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    async updateOne(@Body() chapter:IUpdateChapter, @Param('id',ParseUUIDPipe) id:string){
        try{
            await this.chaptersService.updateOne(id,chapter);
            return {message:'ok'}
        }catch(e){
            throw new HttpException('Unknown error occured',HttpStatus.BAD_REQUEST);   
        }
    }

    
    @Get()
    @Roles(UserRole.USER)
    async getChapters(@Query() queryParams:GetChaptersDto){
        return this.chaptersService.getChaptersByGroupId(queryParams.groupId);
    }

    @Get(':id')
    @Roles(UserRole.USER)
    async getVideos(@Param() params:GetVideosDto){
        return this.chaptersService.findOne(params.id);
    }
}
