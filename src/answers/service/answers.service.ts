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

    addAnswer(answer:Answer):Promise<Answer>{
        return this.answersRepo.save(answer);
    }

    updateOne(id:string,answer:Answer){
        return this.answersRepo.update({id},answer);
    }
}
