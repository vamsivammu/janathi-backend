import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
}
