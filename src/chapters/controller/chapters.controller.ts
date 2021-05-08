import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { uploadImage } from 'src/helpers/fileUploader';
import { UserRole } from 'src/user/models/user.interface';
import { GetChaptersDto } from '../dto/getChapters.dto';
import { GetVideosDto } from '../dto/getVideos.dto';
import { Chapter } from '../models/chapter.entity';
import { INewChapter } from '../models/chapters.interface';
import { ChaptersService } from '../service/chapters.service';


@UseGuards(JwtGuard)
@Controller('chapters')
export class ChaptersController {

    constructor(
        private chaptersService:ChaptersService
    ){  }

    @Post()
    @Roles(UserRole.ADMIN)
    @UseInterceptors(FileInterceptor('img'))
    async createOne(@UploadedFile() img:Express.Multer.File, @Body() chapter:INewChapter){
        try{
            const newChapter = await this.chaptersService.createOne(chapter);
            const id = newChapter.identifiers[0].id;
            await uploadImage(img,id);
            return newChapter;
        }catch(e){
            throw new HttpException('Unknown error occured',HttpStatus.BAD_REQUEST);
        }
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @UseInterceptors(FileInterceptor('img'))
    async updateOne(@Body() chapter:Chapter, @Param('id',ParseUUIDPipe) id:string,@UploadedFile() img?:Express.Multer.File){
        try{
            await this.chaptersService.updateOne(id,chapter);
            if(img.buffer.length>0){
                await uploadImage(img,id);
            }
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
    @Roles(UserRole.ADMIN)
    async getVideos(@Param() params:GetVideosDto){
        return this.chaptersService.findOne(params.id);
    }
}
