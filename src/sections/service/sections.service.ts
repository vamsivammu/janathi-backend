import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from 'src/quiz/models/quiz.entity';
import { Repository } from 'typeorm';
import { Section } from '../models/section.entity';

@Injectable()
export class SectionsService {
    constructor(
        @InjectRepository(Section)
        private sectionRepo:Repository<Section>
    ){  }

    create(name:string,quizId:string){
        const newSection = this.sectionRepo.create();
        newSection.name = name;
        newSection.quizId = quizId;
        return this.sectionRepo.insert(newSection);
    }
    update(id:string,name:string){
        return this.sectionRepo.update({id},{name});
    }

    delete(id:string){
        return this.sectionRepo.delete(id);
    }
}
