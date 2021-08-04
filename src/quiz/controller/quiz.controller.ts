import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AttemptsService } from 'src/attempts/service/attempts.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { GROUPS } from 'src/chapters/models/chapters.interface';
import { NewQuestionDto } from 'src/questions/dto/NewQuestion.dto';
import { Question } from 'src/questions/models/question.entity';
import { S3UploaderService } from 'src/s3-uploader/s3-uploader.service';
import { UserRole } from 'src/user/models/user.interface';
import { NewAttemptDto } from '../dto/NewAttempt.dto';
import { NewQuizDto } from '../dto/NewQuiz.dto';
import { QuizGuard } from '../guards/quiz.guard';
import { Quiz } from '../models/quiz.entity';
import { IQuiz, QUIZ_TYPE } from '../models/quiz.interface';
import { QuizService } from '../service/quiz.service';

@UseGuards(JwtGuard,RolesGuard)
@Controller('quiz')
export class QuizController {
    constructor(private quizService:QuizService,private attemptsService:AttemptsService,private s3Service:S3UploaderService){   }

    @Post()
    @Roles(UserRole.ADMIN)
    create(@Body() quiz:NewQuizDto){
        return this.quizService.create(quiz);
    }

    @Get('stats')
    @Roles(UserRole.ADMIN)
    getStats(@Query('quizId') quizId:string){
        return this.attemptsService.getStatistics(quizId);
    }

    @Get('list')
    @Roles(UserRole.USER)
    getAllQuizzes(@Query('groupId') groupId:GROUPS, @Query('type') type:QUIZ_TYPE, @Req() req:Request){
        return this.quizService.getQuizList(groupId,type,req.user['role']);
    }

    @Get('student/:id')
    @Roles(UserRole.USER)
    getQuizInfoForStudent(@Param('id',ParseUUIDPipe) quizId:string,@Req() req:Request){
        return this.quizService.getQuizInfoForStudent(quizId,req.user['id']);        
    }

    @Get(':id/questions')
    @Roles(UserRole.ADMIN)
    getQuestions(@Param('id',ParseUUIDPipe) id:string):Promise<Quiz>{
        return this.quizService.getQuestions(id);
    }

    @Get(':id/answers')
    @Roles(UserRole.ADMIN)
    getAnswers(@Param('id',ParseUUIDPipe) id:string):Promise<Quiz>{
        return this.quizService.getAnswers(id);
    }

    @Get(':id')
    @Roles(UserRole.ADMIN)
    async findOne(@Param('id',ParseUUIDPipe) id:string):Promise<IQuiz>{
        return this.quizService.getQuestionsAndAnswers(id);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    async updateOne(@Param('id',ParseUUIDPipe) id:string,@Body() updatedQuizInfo:{started?:boolean}):Promise<any>{
        return this.quizService.updateQuizInfo(id,updatedQuizInfo);
    }


    @Post('/attempt/:quizId')
    @UseGuards(QuizGuard)
    @Roles(UserRole.USER)
    attemptQuiz(@Param('quizId',ParseUUIDPipe) quizId:string,@Req() req:Request, @Body() newAttempt:NewAttemptDto){
        return this.quizService.attemptQuiz(quizId,req.user['id'],newAttempt);        
    }


    @Post(':id/add-question')
    @Roles(UserRole.ADMIN)
    @UseInterceptors(FileFieldsInterceptor([{name:'choices[]',maxCount:4},{name:'qimages[]',maxCount:2}]))
    addQuestion(@Param('id',ParseUUIDPipe) id:string,@UploadedFiles() files:any,@Body() question:NewQuestionDto):Promise<Question>{
        return this.quizService.addQuestion(id,question,files);
    }



}

