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

    async insertChoices(choices:string[], questionId:string,areImages:boolean):Promise<string[]>{
        let options:Choice[] = [];
        choices.forEach(choice=>{
            const option = new Choice();
            if(areImages){
                option.imgUrl=choice;
            }else{
                option.content = choice;
            }
            option.questionId = questionId;
            options.push(option);
        })
        const insertedResponse = await this.choiceRepository.insert(options);
        const choiceIds = insertedResponse.identifiers.map(e=>e.id);
        return choiceIds;
    }
}
