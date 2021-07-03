import { Body, Controller, Param, ParseUUIDPipe, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/user/models/user.interface';
import { QuizPdfsService } from '../service/quiz-pdfs.service';

@Controller('quiz-pdfs')
export class QuizPdfsController {
    constructor(
        private quizPdfService:QuizPdfsService
    ){  }


    @Post()
    @Roles(UserRole.ADMIN)
    @UseInterceptors(FileInterceptor('file'))
    insertFile(@UploadedFile() file:Express.Multer.File, @Body() newQuizPdf){
        return this.quizPdfService.insertFile(file,newQuizPdf.quizId,newQuizPdf.paperId);
    }
    
    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @UseInterceptors(FileInterceptor('file'))
    updateFile(@UploadedFile() file:Express.Multer.File, @Param('id',ParseUUIDPipe) id:string){
        return this.quizPdfService.updateFile(file,id);
    }
}
