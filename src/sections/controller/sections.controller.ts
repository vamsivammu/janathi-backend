import { BadRequestException, Body, Controller, Delete, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { QuizService } from 'src/quiz/service/quiz.service';
import { NewSectionDto } from '../dto/NewSection.dto';
import { SectionsService } from '../service/sections.service';

@Controller('sections')
export class SectionsController {
    constructor(
        private sectionService:SectionsService,
        private quizService:QuizService
    ){  }

    @Post()
    async addSection(@Body() section:NewSectionDto){
        try{
            const insertedResp = await this.sectionService.create(section.name,section.quizId);
            const id = insertedResp.identifiers[0].id;
            return {id};
        }catch(e){
            throw new BadRequestException();
        }
    }

    @Patch(':id')
    async updateSection(@Param('id',ParseUUIDPipe) id:string,@Body() section:NewSectionDto){
        try{
            await this.sectionService.update(id,section.name);
            return {};
        }catch(e){
            throw new BadRequestException();
        }
    }

    @Delete(':id')
    async deleteSection(@Param('id',ParseUUIDPipe) id:string){
        try{
            await this.sectionService.delete(id);
            return {};
        }catch(e){
            throw new BadRequestException();
        }
    }
}
