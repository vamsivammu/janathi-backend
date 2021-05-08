import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChaptersModule } from 'src/chapters/chapters.module';
import { VideosController } from './controller/videos.controller';
import { Video } from './models/video.entity';
import { VideosService } from './service/videos.service';

@Module({
  imports:[TypeOrmModule.forFeature([Video]),ChaptersModule],
  controllers: [VideosController],
  providers: [VideosService]
})
export class VideosModule {}
