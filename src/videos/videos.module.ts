import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChaptersModule } from 'src/chapters/chapters.module';
import { PaymentsModule } from 'src/payments/payments.module';
import { VideosController } from './controller/videos.controller';
import { VideoGuard } from './guards/video.guard';
import { Video } from './models/video.entity';
import { VideosService } from './service/videos.service';

@Module({
  imports:[PaymentsModule,TypeOrmModule.forFeature([Video]),ChaptersModule],
  controllers: [VideosController],
  providers: [VideosService,VideoGuard],
})
export class VideosModule {}
