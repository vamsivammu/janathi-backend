import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Choice } from '../models/choice.entity';

@Injectable()
export class ChoicesService {
    constructor(
        @InjectRepository(Choice)
        private choiceRepository:Repository<Choice>
    ){  }

    async insertChoices(choices:string[], questionId:string):Promise<Choice[]>{
        let options:Choice[] = [];
        choices.forEach(choice=>{
            const option = new Choice();
            option.content = choice;
            option.questionId = questionId;
            options.push(option);
        })
        console.log(choices);
        const insertedResponse = await this.choiceRepository.insert(options);
        const choiceIds = insertedResponse.identifiers.map(e=>e.id);
        return await this.choiceRepository.findByIds(choiceIds);
    }
}
