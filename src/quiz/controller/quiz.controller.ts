import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { IAnswer } from 'src/answers/models/answer.interface';
import { GROUPS } from 'src/chapters/models/chapters.interface';
import { NewQuestionDto } from 'src/questions/dto/NewQuestion.dto';
import { Question } from 'src/questions/models/question.entity';
import { NewAttemptDto } from '../dto/NewAttempt.dto';
import { NewQuizDto } from '../dto/NewQuiz.dto';
import { Quiz } from '../models/quiz.entity';
import { IQuiz } from '../models/quiz.interface';
import { QuizService } from '../service/quiz.service';

@Controller('quiz')
export class QuizController {
    constructor(private quizService:QuizService){   }

    @Post()
    create(@Body() quiz:NewQuizDto){
        return this.quizService.create(quiz);
    }
    
    @Get('list')
    getAllQuizzes(@Query('groupId') groupId:GROUPS){
        return this.quizService.getQuizList(groupId);
    }

    @Get('student/:id')
    getQuizInfoForStudent(@Param('id',ParseUUIDPipe) quizId:string,@Req() req:Request){
        return this.quizService.getQuizInfoForStudent(quizId,req.user['id']);        
    }

    @Get(':id/questions')
    getQuestions(@Param('id',ParseUUIDPipe) id:string):Promise<Quiz>{
        return this.quizService.getQuestions(id);
    }

    @Get(':id/answers')
    getAnswers(@Param('id',ParseUUIDPipe) id:string):Promise<Quiz>{
        return this.quizService.getAnswers(id);
    }

    @Get(':id')
    async findOne(@Param('id',ParseUUIDPipe) id:string):Promise<IQuiz>{
        return this.quizService.getQuestionsAndAnswers(id);
    }



    @Post(':id/add-question')
    addQuestion(@Param('id',ParseUUIDPipe) id:string,@Body() question:NewQuestionDto):Promise<Question>{
        return this.quizService.addQuestion(id,question);
    }

    @Post('/attempt/:quizId')
    attemptQuiz(@Param('quizId',ParseUUIDPipe) quizId:string,@Req() req:Request, newAttempt:NewAttemptDto){
        return this.quizService.attemptQuiz(quizId,req.user['id'],newAttempt);        
    }


}

