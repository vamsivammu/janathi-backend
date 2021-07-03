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
        var values = ["",""];
        let respRecords = [];
        for(var i=0;i<responseIds.length;i++){
            // const value1 = `'${responseIds[i]}'`;
            // const value2 = `'${responses[responseIds[i]]}'`;
            // if(i==0){
            //     values[0] = values[0] + value1;
            //     values[1] = values[1] + value2;
            // }else{
            //     values[0] = values[0] + ',';
            //     values[1] = values[1] + ',';
            //     values[0] = values[0] + value1;
            //     values[1] = values[1] + value2;                
            // }
            const r = new Response();
            r.id = responseIds[i];
            r.choiceId = responses[responseIds[i]];
            respRecords.push(r);
        }
        await this.responseRepo.save(respRecords);
        // await this.responseRepo
        // .query(
        //     `WITH c AS (
        //         SELECT unnest(array[${values[0]}]) AS id,
        //               unnest(array[${values[1]}]) AS choiceId
        //     )
        //     UPDATE response AS r 
        //     SET r.choiceId = c.choiceId
        //     FROM c
        //     WHERE response.id = c.id::uuid;`
        // )

    }

    getResponses(attemptId:string){
        return this.responseRepo
                .createQueryBuilder('responses')
                .where('responses.attemptId = :attemptId',{attemptId})
                .leftJoinAndSelect('responses.question','question')
                .leftJoinAndSelect('question.choices','choices')
                .getMany();
    }

    async deleteResponses(attemptId:string){
        await this.responseRepo.delete({attemptId});
    }
}
