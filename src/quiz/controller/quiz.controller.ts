import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { IAnswer } from 'src/answers/models/answer.interface';
import { Question } from 'src/questions/models/question.entity';
import { IQuestion } from 'src/questions/models/question.interface';
import { NewQuizDto } from '../dto/NewQuiz.dto';
import { Quiz } from '../models/quiz.entity';
import { ICreateQuiz } from '../models/quiz.interface';
import { QuizService } from '../service/quiz.service';

@Controller('quiz')
export class QuizController {
    constructor(private quizService:QuizService){   }

    @Post()
    create(@Body() quiz:NewQuizDto){
        return this.quizService.create(quiz);
    }

    @Get(':id')
    findOne(@Param('id',ParseUUIDPipe) id:string):Promise<Quiz>{
        return this.quizService.findOne(id);
    }

    @Get(':id/questions')
    getQuestions(@Param('id',ParseUUIDPipe) id:string):Promise<Quiz>{
        return this.quizService.getQuestions(id);
    }

    @Get(':id/answers')
    getAnswers(@Param('id',ParseUUIDPipe) id:string):Promise<Quiz>{
        return this.quizService.getAnswers(id);
    }

    @Post(':id/add-question')
    addQuestion(@Param('id',ParseUUIDPipe) id:string,@Body('question') question:IQuestion,@Body('answer') answer:IAnswer):Promise<Question>{
        console.log(question,answer);
        return this.quizService.addQuestion(id,question,answer);
    }
}

