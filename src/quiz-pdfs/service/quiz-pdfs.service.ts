import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAPER } from 'src/papers/dto/paper.enum';
import { S3UploaderService } from 'src/s3-uploader/s3-uploader.service';
import { Repository } from 'typeorm';
import { QuizPdfs } from '../models/quiz-pdfs.entity';

@Injectable()
export class QuizPdfsService {
    constructor(
        @InjectRepository(QuizPdfs)
        private quizPdfRepo:Repository<QuizPdfs>,
        private s3Uploader:S3UploaderService
    ){  }

    async insertFile(file:Express.Multer.File,quizId:string,paperId:PAPER|null){
        const quizPdf = new QuizPdfs();
        quizPdf.quizId = quizId;
        quizPdf.paperId = paperId;
        const resp = await this.quizPdfRepo.insert(quizPdf);
        const id = resp.identifiers[0].id;
        await this.s3Uploader.uploadQuizPdf(file,id);
    }

    async updateFile(file:Express.Multer.File,quizPdfId:string){
        const quizPdf = await this.quizPdfRepo.findOneOrFail(quizPdfId);
        if(quizPdf){
            await this.s3Uploader.uploadQuizPdf(file,quizPdfId);
        }
    }

    async getFileId(quizId:string,paperId:PAPER|null){
        if(paperId){
            const quizPdf = await this.quizPdfRepo
            .createQueryBuilder('quizpdf')
            .where('quizpdf.quizId = :quizId',{quizId})
            .andWhere('quizpdf.paperId = :paperId',{paperId})
            .getOne();
            return quizPdf?.id;
        }else{
            const quizPdf = await this.quizPdfRepo
            .createQueryBuilder('quizpdf')
            .where('quizpdf.quizId = :quizId',{quizId})
            .getOne();
            return quizPdf?.id;
        }
    }
}
