import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnswersService } from 'src/answers/service/answers.service';
import { IUserBody } from 'src/auth/models/auth.interface';
import { GROUPS } from 'src/chapters/models/chapters.interface';
import { PAPER } from 'src/papers/dto/paper.enum';
import { QuestionsService } from 'src/questions/service/questions.service';
import { ResponsesDto } from 'src/responses/dto/responses.dto';
import { ResponsesService } from 'src/responses/service/responses.service';
import { Repository } from 'typeorm';
import { Attempt } from '../models/attempt.entity';
import { PaperConfig, SectionConfig } from 'src/papers/dto/paper.enum';
import { QuizPdfsService } from 'src/quiz-pdfs/service/quiz-pdfs.service';

@Injectable()
export class AttemptsService {
    constructor(
        @InjectRepository(Attempt)
        private attemptsRepo:Repository<Attempt>,
        private responseService:ResponsesService,
        private answersService:AnswersService,
        private quizPdfService:QuizPdfsService
    ){  }
    
    getAttemptsForOneQuiz(quizId:string,userId:string){
        return this.attemptsRepo
        .createQueryBuilder('attempts')
        .where('attempts.quizId = :quizId',{quizId})
        .andWhere('attempts.userId = :userId',{userId})
        .getMany();
    }

    checkIfAlreadyAttempted(quizId:string,paperId:PAPER|null,userId:string){
        if(paperId){
            return this.attemptsRepo
            .createQueryBuilder('attempts')
            .where('attempts.quizId = :quizId',{quizId})
            .andWhere('attempts.userId = :userId',{userId})
            .andWhere('attempts.paperId = :paperId',{paperId})
            .getOne();
        }else{
            return this.attemptsRepo
            .createQueryBuilder('attempts')
            .where('attempts.quizId = :quizId',{quizId})
            .andWhere('attempts.userId = :userId',{userId})
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

    async submitResponses(attemptId:string,responses:ResponsesDto,userId:string){
        try{
            const attemptInfo = await this.attemptsRepo
                    .createQueryBuilder('attempt')
                    .where('attempt.id = :attemptId',{attemptId})
                    .andWhere('attempt.userId = :userId',{userId})
                    .getOneOrFail();
            if(attemptInfo.completed){
                throw new UnauthorizedException();
            }
            await this.responseService.saveResponses(responses.responseIdMap);
            const answers = await this.getCorrectAnswers(attemptId);
            let score = 0;
            answers.forEach(answer=>{
                if(responses.questionIdMap[answer.questionId] == answer.choiceId){
                    score = score + 1;
                }
            })
            await this.attemptsRepo
            .createQueryBuilder('attempt')
            .update()
            .where('attempt.id = :attemptId',{attemptId})
            .set({completed:true,score:score})
            .execute();
            
        }catch(err){
            console.log(err);
            throw new UnauthorizedException();
        }
    }
    getConfiguration(category:GROUPS,paperId:PAPER){
        let configuration:any = {};
        configuration.section = SectionConfig[category]?.[paperId];
        return configuration;
    }
    async getAttempt(attemptId:string,user:IUserBody){
        const attempt = await this.attemptsRepo
                        .createQueryBuilder('attempt')
                        .where('attempt.id = :attemptId',{attemptId})
                        .leftJoinAndSelect('attempt.quiz','quiz')
                        .leftJoinAndSelect('attempt.responses','responses')
                        .leftJoinAndSelect('responses.question','question')
                        .leftJoinAndSelect('question.choices','choices')
                        .getOne();
        if(attempt.userId==user.id && attempt.completed){
            const answers = await this.answersService.getAnswers(attempt.quizId,attempt.paperId);
            const quizPdf = await this.quizPdfService.getFileId(attempt.quizId,attempt.paperId);
            return {...attempt,quiz:{...attempt.quiz,answers,configuration:this.getConfiguration(attempt.quiz.category,attempt.paperId),pdfId:quizPdf}};
        }
        if(attempt.userId==user.id){
            return {...attempt,quiz:{...attempt.quiz,configuration:this.getConfiguration(attempt.quiz.category,attempt.paperId)}};
        }
        throw new UnauthorizedException();
    }

    async getAttemptScore(attemptId:string, userId:string){
        const attempt = await this.attemptsRepo.findOneOrFail(attemptId,{relations:['quiz']});
        if(attempt.completed && attempt.userId == userId){
            return attempt;
        }
        throw new UnauthorizedException();
    }

    async deleteAttempt(attemptId:string,userId:string){
        const attempt = await this.attemptsRepo.findOneOrFail(attemptId);
        if(attempt.userId != userId){
            throw new UnauthorizedException();
        }
        await this.responseService.deleteResponses(attemptId);
        await this.attemptsRepo.delete({id:attemptId});
    }


    async getStatistics(quizId:string){
        return this.attemptsRepo
                .createQueryBuilder('attempt')
                .where('attempt.quizId = :quizId',{quizId})
                .andWhere('attempt.completed = :completed',{completed:true})
                .leftJoinAndSelect('attempt.user','user')
                .getMany();
                
    }
}
