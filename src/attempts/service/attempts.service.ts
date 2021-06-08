import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnswersService } from 'src/answers/service/answers.service';
import { PAPER } from 'src/papers/dto/paper.enum';
import { QuestionsService } from 'src/questions/service/questions.service';
import { ResponsesDto } from 'src/responses/dto/responses.dto';
import { ResponsesService } from 'src/responses/service/responses.service';
import { Repository } from 'typeorm';
import { Attempt } from '../models/attempt.entity';

@Injectable()
export class AttemptsService {
    constructor(
        @InjectRepository(Attempt)
        private attemptsRepo:Repository<Attempt>,
        private responseService:ResponsesService,
        private answersService:AnswersService
    ){  }
    
    getAttemptsForOneQuiz(quizId:string,userId:string){
        return this.attemptsRepo
        .createQueryBuilder('attempts')
        .where('quizId = :quizId',{quizId})
        .andWhere('userId = :userId',{userId})
        .getMany();
    }

    checkIfAlreadyAttempted(quizId:string,paperId:PAPER|null,userId:string){
        if(paperId){
            return this.attemptsRepo
            .createQueryBuilder('attempts')
            .where('quizId = :quizId',{quizId})
            .andWhere('userId = :userId',{userId})
            .andWhere('paperId = :paperId',{paperId})
            .getOne();
        }else{
            return this.attemptsRepo
            .createQueryBuilder('attempts')
            .where('quizId = :quizId',{quizId})
            .andWhere('userId = :userId',{userId})
            .getOne();
        }
    }

    async createAttempt(quizId:string,paperId:PAPER|null,userId:string){
        const newAttempt = new Attempt();
        newAttempt.paperId = paperId;
        newAttempt.userId = userId;
        newAttempt.quizId = quizId;
        const response = await this.attemptsRepo.insert(newAttempt);
        const attemptId = response.identifiers[0].id;
        await this.responseService.insertResponses(quizId,paperId,attemptId);
        return attemptId;
    }

    async getAttemptInfo(attemptId:string){
        return this.attemptsRepo.findOne(attemptId);
    }

    async getCorrectAnswers(attemptId:string){
        const attemptInfo = await this.getAttemptInfo(attemptId);
        const answers = await this.answersService.getAnswers(attemptInfo.quizId,attemptInfo.paperId);
        return answers;
    }

    async submitResponses(attemptId:string,responses:ResponsesDto){
        try{
            await this.responseService.saveResponses(responses.responseIdMap);
            const answers = await this.getCorrectAnswers(attemptId);
            let score = 0;
            answers.forEach(answer=>{
                if(responses.questionIdMap[answer.questionId] == answer.choiceId){
                    score = score + 1;
                }
            })
            this.attemptsRepo
            .createQueryBuilder('attempt')
            .update()
            .where('attempt.id = :attemptId',{attemptId})
            .set({completed:true,score:score})
            .execute();
            
        }catch(err){
            console.log(err);
        }
    }

    async getAttempt(attemptId:string){
        return this.attemptsRepo
                .createQueryBuilder('attempt')
                .where('attempt.id = :attemptId',{attemptId})
                .leftJoinAndSelect('attempt.responses','responses')
                .leftJoinAndSelect('responses.question','question')
                .leftJoinAndSelect('question.choices','choices')
                .getOne();
    }
}
