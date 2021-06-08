import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionsService } from 'src/questions/service/questions.service';
import { Repository } from 'typeorm';
import { Response } from '../models/response.entity';

@Injectable()
export class ResponsesService {
    constructor(
        @InjectRepository(Response)
        private responseRepo:Repository<Response>,
        private questionsService:QuestionsService
    ){  }

    async insertResponses(quizId:string, paperId:string|null, attemptId:string){
        const questions = await this.questionsService.getQuestions(quizId,paperId);
        const responses = [];
        questions.forEach(q=>{
            const newResponse = new Response();
            newResponse.attemptId = attemptId;
            newResponse.questionId = q.id;
            responses.push(newResponse);
        })
        return this.responseRepo.insert(responses);
    }

    async saveResponses(responses:any){
        const responseIds = Object.keys(responses);
        var values = "";
        for(var i=0;i<responseIds.length;i++){
            const value = `('${responseIds[i]}','${responses[responseIds[i]]}')`;
            if(i==0){
                values = values + value;
            }else{
                values = values + ',';
                values = values + value;
            }
        }
        await this.responseRepo
        .query(
            `
            update Response as r set
            choiceId = c.choiceId
            from (values
             ${values} 
            ) as c(id,choiceId)
            where r.id = c.id;
            `
        )
    }

    getResponses(attemptId:string){
        return this.responseRepo
                .createQueryBuilder('responses')
                .where('responses.attemptId = :attemptId',{attemptId})
                .leftJoinAndSelect('responses.question','question')
                .leftJoinAndSelect('question.choices','choices')
                .getMany();
    }
}
