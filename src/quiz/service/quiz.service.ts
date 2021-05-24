import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from 'src/answers/models/answer.entity';
import { AnswersService } from 'src/answers/service/answers.service';
import { GROUPS } from 'src/chapters/models/chapters.interface';
import { ChoicesService } from 'src/choices/service/choices.service';
import { PaperConfig, SectionConfig } from 'src/papers/dto/paper.enum';
import { NewQuestionDto } from 'src/questions/dto/NewQuestion.dto';
import { Question } from 'src/questions/models/question.entity';
import { QuestionsService } from 'src/questions/service/questions.service';
import { Repository } from 'typeorm';
import { Quiz } from '../models/quiz.entity';
import { ICreateQuiz, IQuiz } from '../models/quiz.interface';

@Injectable()
export class QuizService {

    constructor(
        @InjectRepository(Quiz) 
        private quizRepo:Repository<Quiz>,
        private questionService:QuestionsService,
        private answerService:AnswersService,
        private choiceService:ChoicesService
    ){  }

    async create(quiz:ICreateQuiz):Promise<IQuiz>{
        try{
            const insertedResp = await this.quizRepo.insert(quiz);
            const id = insertedResp.identifiers[0].id;
            const newQuiz = await this.quizRepo.findOne(id);
            return {...newQuiz,configuration:this.getConfiguration(quiz.category)}
        }catch(e){
            throw new BadRequestException();
        }
    }

    updateOne(id:string,quiz:ICreateQuiz):Promise<any>{
        return this.quizRepo.update({id},quiz)
    }

    async findOne(id:string):Promise<Quiz>{
        try{
            return await this.quizRepo.findOneOrFail({id});
        }catch(e){
            throw new BadRequestException('Quiz not found');
        }
    }

    getQuestions(id:string):Promise<Quiz>{
        return this.quizRepo
        .createQueryBuilder('quiz')
        .where('quiz.id = :id',{id})
        .loadRelationCountAndMap('quiz.questionCount','quiz.questions')
        .getOne();
    }

    async getQuizInfo(quizId:string,studentId:string){
        const quiz = await this.findOne(quizId);
        
    }

    getQuizList(groupId:GROUPS){
        return this.quizRepo
        .createQueryBuilder('quiz')
        .where('quiz.category = :groupId',{groupId})
        .getMany();
    }

    async getQuestionsAndAnswers(id:string){
        const quiz = await this.quizRepo
        .createQueryBuilder('quiz')
        .where('quiz.id = :id',{id})
        .leftJoinAndSelect('quiz.questions','questions')
        .leftJoinAndSelect('questions.choices','choices')
        .leftJoinAndSelect('questions.answer','answer')
        .getOneOrFail();
        return {...quiz,configuration:this.getConfiguration(quiz.category)}
    }

    getAnswers(id:string):Promise<Quiz>{
        return this.quizRepo.findOne({id},{relations:['answers']});
    }

    getConfiguration(category:GROUPS){
        let configuration:any = {};
        configuration.paper = PaperConfig[category];
        configuration.section = SectionConfig[category];
        return configuration;
    }

    async addQuestion(id:string,question:NewQuestionDto):Promise<Question>{
        const quiz = await this.findOne(id);
        const newQuestion = new Question();
        newQuestion.questionContent = question.questionContent;
        newQuestion.quiz = quiz;
        newQuestion.paperId = question.paperId;
        newQuestion.sectionId = question.sectionId;
        const createdQuestionId = await this.questionService.addQuestion(newQuestion);
        const choices = await this.choiceService.insertChoices(question.choices,createdQuestionId);
        const answerChoice = choices.find(choice=>choice.content==question.answer);
        const newAnswer = new Answer();
        newAnswer.quizId = id;
        newAnswer.questionId = createdQuestionId;
        newAnswer.choiceId = answerChoice.id;
        newAnswer.paperId = question.paperId;
        await this.answerService.addAnswer(newAnswer);
        return this.questionService.getQuestion(createdQuestionId)
    }
}
