import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAPER } from 'src/papers/dto/paper.enum';
import { Repository } from 'typeorm';
import { Answer } from '../models/answer.entity';

@Injectable()
export class AnswersService {
    constructor(
        @InjectRepository(Answer)
        private answersRepo:Repository<Answer>
    ){  }

    async addAnswer(answer:Answer){
        await this.answersRepo.insert(answer);
    }

    updateOne(id:string,answer:Answer){
        return this.answersRepo.update({id},answer);
    }

    getAnswers(quizId:string,paperId:PAPER){
        if(paperId){
            return this.answersRepo
                    .createQueryBuilder('answer')
                    .where('answer.quizId = :quizId',{quizId})
                    .andWhere('answer.paperId = :paperId',{paperId})
                    .getMany();
        }else{
            return this.answersRepo
                    .createQueryBuilder('answer')
                    .where('answer.quizId = :quizId',{quizId})
                    .getMany();
        }
    }

    async deleteAnswer(questionId:string){
        await this.answersRepo.delete({questionId});
    }
}
