import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnswersService } from 'src/answers/service/answers.service';
import { ChoicesService } from 'src/choices/service/choices.service';
import { S3UploaderService } from 'src/s3-uploader/s3-uploader.service';
import { Repository } from 'typeorm';
import { Question } from '../models/question.entity';
@Injectable()
export class QuestionsService {
    constructor(
        @InjectRepository(Question)
        private questionRepo:Repository<Question>,

        private s3UploaderService:S3UploaderService,
        private choicesService:ChoicesService,
        private answerService:AnswersService
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
        const questionData = await this.questionRepo.createQueryBuilder('question').leftJoinAndSelect('question.choices','choices').where('question.id = :id',{id}).getOneOrFail();
        await this.s3UploaderService.deleteQuestionImageAndChoiceImages(questionData.id,questionData.images,questionData.choices);
        // await this.choicesService.deleteChoices(questionData.id);
        // await this.answerService.deleteAnswer(questionData.id);
        await this.questionRepo.delete({id:questionData.id});
    }

    async updateQImages(extensions:string[],questionId:string){
        await this.questionRepo.update({id:questionId},{images:extensions});
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
