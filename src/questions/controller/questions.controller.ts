import { Body, Controller, Param, ParseUUIDPipe, Patch, Post, Put } from '@nestjs/common';
import { Answer } from 'src/answers/models/answer.entity';
import { AnswersService } from 'src/answers/service/answers.service';
import { Question } from '../models/question.entity';
import { QuestionsService } from '../service/questions.service';

@Controller('questions')
export class QuestionsController {
    constructor(
        private questionsService:QuestionsService,
        private answersService:AnswersService
    ){  }
    
    @Put(':id')
    async updateQuestion(@Param('id',ParseUUIDPipe) id:string, @Body('question') question:Question,@Body('answer') answer:Answer ){
        await this.questionsService.updateOne(id,question);
        await this.answersService.updateOne(answer.id,answer);
        return {message:'updated'};
    }
}
