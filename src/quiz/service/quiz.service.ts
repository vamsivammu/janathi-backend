import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from 'src/answers/models/answer.entity';
import { IAnswer } from 'src/answers/models/answer.interface';
import { AnswersService } from 'src/answers/service/answers.service';
import { Question } from 'src/questions/models/question.entity';
import { IQuestion } from 'src/questions/models/question.interface';
import { QuestionsService } from 'src/questions/service/questions.service';
import { Repository } from 'typeorm';
import { Quiz } from '../models/quiz.entity';
import { ICreateQuiz } from '../models/quiz.interface';

@Injectable()
export class QuizService {

    constructor(
        @InjectRepository(Quiz) 
        private quizRepo:Repository<Quiz>,
        private questionService:QuestionsService,
        private answerService:AnswersService
    ){  }

    async create(quiz:ICreateQuiz):Promise<Quiz>{
        try{
            const insertedResp = await this.quizRepo.insert(quiz);
            const id = insertedResp.identifiers[0].id;
            return this.quizRepo.findOne(id);    
        }catch(e){
            throw new BadRequestException();
        }
    }

    updateOne(id:string,quiz:ICreateQuiz):Promise<any>{
        return this.quizRepo.update({id},quiz)
    }

    async findOne(id:string):Promise<Quiz>{
        try{
            return await this.quizRepo.findOneOrFail({id},{relations:['sections']});
        }catch(e){
            throw new BadRequestException('Quiz not found');
        }
    }

    getQuestions(id:string):Promise<Quiz>{
        // return this.quizRepo.findOne({id},{relations:['questions']});
        return this.quizRepo.createQueryBuilder('quiz').where('quiz.id = :id',{id}).loadRelationCountAndMap('quiz.questionCount','quiz.questions').getOne();
    }

    getAnswers(id:string):Promise<Quiz>{
        return this.quizRepo.findOne({id},{relations:['answers']});
    }

    async addQuestion(id:string,question:IQuestion,answer:IAnswer):Promise<Question>{
        const quiz = await this.findOne(id);
        const newQuestion = new Question();
        newQuestion.questionContent = question.questionContent;
        newQuestion.images = question.images;
        newQuestion.quiz = quiz;
        const createdQuestion = await this.questionService.addQuestion(newQuestion);
        const newAnswer = new Answer();
        newAnswer.answerContent = answer.answerContent;
        newAnswer.quiz = quiz;
        newAnswer.reason = answer.reason;
        newAnswer.question = newQuestion;
        const createdAnswer = await this.answerService.addAnswer(newAnswer);
        delete createdAnswer['question'];
        delete createdAnswer['quiz'];
        createdQuestion.answer = createdAnswer;
        return createdQuestion;
    }
}
