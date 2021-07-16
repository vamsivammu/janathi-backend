import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../models/question.entity';
@Injectable()
export class QuestionsService {
    constructor(
        @InjectRepository(Question)
        private questionRepo:Repository<Question>
    ){  }
    
    async addQuestion(question:Question):Promise<string>{
        const insertedQuestionResp = await this.questionRepo.insert(question);
        return insertedQuestionResp.identifiers[0].id;
    }

    updateOne(id:string,question:Question):Promise<any>{
        return this.questionRepo.update({id},question);
    }
    
    getQuestion(id:string):Promise<Question>{
        return this.questionRepo.findOne(id,{relations:['choices','answer']})
    }

    softDelete(id:string,isDeleted:boolean){
        return this.questionRepo.update({id},{isDeleted});
    }

    async removeQuestion(id:string){

    }

    getQuestions(quizId:string,paperId:string|null){
        if(paperId){
            return this.questionRepo
                   .createQueryBuilder('question')
                   .select(['question.id'])
                   .where('question.quizId = :quizId',{quizId})
                   .andWhere('question.paperId = :paperId',{paperId})
                   .andWhere('question.isDeleted = FALSE')
                   .getMany();
        }else{
            return this.questionRepo
                   .createQueryBuilder('question')
                   .select(['question.id'])
                   .where('question.quizId = :quizId',{quizId})
                   .andWhere('question.isDeleted = FALSE')
                   .getMany();
        }
    }
}
