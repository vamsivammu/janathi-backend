import { Body, Controller, Delete, Param, ParseUUIDPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Answer } from 'src/answers/models/answer.entity';
import { AnswersService } from 'src/answers/service/answers.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/user/models/user.interface';
import { Question } from '../models/question.entity';
import { QuestionsService } from '../service/questions.service';

@UseGuards(JwtGuard,RolesGuard)
@Controller('questions')
export class QuestionsController {
    constructor(
        private questionsService:QuestionsService,
        private answersService:AnswersService
    ){  }
    

    @Put(':id')
    @Roles(UserRole.ADMIN)
    async updateQuestion(@Param('id',ParseUUIDPipe) id:string, @Body('question') question:Question,@Body('answer') answer:Answer ){
        await this.questionsService.updateOne(id,question);
        await this.answersService.updateOne(answer.id,answer);
        return {message:'updated'};
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    async softDelete(@Param('id',ParseUUIDPipe) id:string, @Query('isDeleted') isDeleted:boolean){
        return this.questionsService.softDelete(id,isDeleted);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    async removeQuestion(@Param('id',ParseUUIDPipe) id:string){
        
    }
}
