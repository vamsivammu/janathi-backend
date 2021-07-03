import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { S3UploaderService } from 'src/s3-uploader/s3-uploader.service';
import { ChaptersController } from './controller/chapters.controller'
import { Chapter } from './models/chapter.entity';
import { ChaptersService } from './service/chapters.service';

@Module({
  imports:[TypeOrmModule.forFeature([Chapter]),AuthModule],
  controllers: [ChaptersController],
  providers: [ChaptersService,S3UploaderService],
  exports: [ChaptersService]
})
export class ChaptersModule {}
