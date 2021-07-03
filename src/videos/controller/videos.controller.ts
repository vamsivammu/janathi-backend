import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ChaptersService } from 'src/chapters/service/chapters.service';
import { uploadVideo } from 'src/helpers/fileUploader';
import { PaymentsService } from 'src/payments/service/payments.service';
import { UserRole } from 'src/user/models/user.interface';
import { GetVideoDto } from '../dto/GetVideo.dto';
import { NewVideo } from '../dto/NewVideo.dto';
import { VideoGuard } from '../guards/video.guard';
import { VideosService } from '../service/videos.service';

@UseGuards(JwtGuard)
@Controller('videos')
export class VideosController {

    constructor(
        private videosService:VideosService,
        private chaptersService:ChaptersService,
        private ps:PaymentsService
    )
    {  }

    @Post()
    @Roles(UserRole.ADMIN)
    @UseInterceptors(FileInterceptor('video'))
    async createVideo(@UploadedFile() video:Express.Multer.File,@Body() videoDetails:NewVideo){
        try{
            const chapter = await this.chaptersService.isValidChapter(videoDetails.chapterId);
            const videoStorageId = await uploadVideo(video,videoDetails.name);
            videoDetails.videoStorageId = videoStorageId;
            return this.videosService.createOne(videoDetails,chapter);
        }catch(e){
            throw new HttpException('Unknown error occured',HttpStatus.BAD_REQUEST);
        }
    }

    @Get(':videoId')
    @UseGuards(VideoGuard)
    @Roles(UserRole.USER)
    async getVideo(@Param() params:GetVideoDto){
        return this.videosService.getVideo(params.videoId);
    }
}
