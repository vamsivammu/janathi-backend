import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../models/question.entity';
import { IQuestion } from '../models/question.interface';

@Injectable()
export class QuestionsService {
    constructor(
        @InjectRepository(Question)
        private questionRepo:Repository<Question>
    ){  }
    
    addQuestion(question:Question):Promise<Question>{
        return this.questionRepo.save(question);
    }

    updateOne(id:string,question:Question):Promise<any>{
        return this.questionRepo.update({id},question);
    }
    
}
