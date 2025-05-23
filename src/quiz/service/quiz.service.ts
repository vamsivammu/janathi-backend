import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from 'src/answers/models/answer.entity';
import { AnswersService } from 'src/answers/service/answers.service';
import { AttemptsService } from 'src/attempts/service/attempts.service';
import { GROUPS } from 'src/chapters/models/chapters.interface';
import { ChoicesService } from 'src/choices/service/choices.service';
import { PaperConfig, SectionConfig } from 'src/papers/dto/paper.enum';
import { planTitles, QUIZ_PLAN_MAP } from 'src/payments/dto/payment.enum';
import { NewQuestionDto } from 'src/questions/dto/NewQuestion.dto';
import { Question } from 'src/questions/models/question.entity';
import { QuestionsService } from 'src/questions/service/questions.service';
import { S3UploaderService } from 'src/s3-uploader/s3-uploader.service';
import { SubscriptionViewService } from 'src/subscription-view/service/subscription-view.service';
import { UserRole } from 'src/user/models/user.interface';
import { Repository } from 'typeorm';
import { NewAttemptDto } from '../dto/NewAttempt.dto';
import { Quiz } from '../models/quiz.entity';
import { ICreateQuiz, QUIZ_TYPE } from '../models/quiz.interface';

@Injectable()
export class QuizService {

    constructor(
        @InjectRepository(Quiz) 
        private quizRepo:Repository<Quiz>,
        private questionService:QuestionsService,
        private answerService:AnswersService,
        private choiceService:ChoicesService,
        private attemptsService:AttemptsService,
        private s3UploaderService:S3UploaderService,
        private subscriptionsViewService:SubscriptionViewService
    ){  }

    async create(quiz:ICreateQuiz){
        try{
            const insertedResp = await this.quizRepo.insert(quiz);
            const id = insertedResp.identifiers[0].id;
            return {id};
        }catch(e){
            throw new BadRequestException();
        }
    }

    updateQuizInfo(quizId:string,updatedQuizInfo:{started?:boolean,name?:string,description?:string}){
        return this.quizRepo
                .createQueryBuilder('quiz')
                .update()
                .set({started:updatedQuizInfo.started})
                .where('quiz.id = :quizId',{quizId})
                .execute();
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

    async getQuizInfoForStudent(quizId:string,studentId:string){
        const quiz = await this.findOne(quizId);
        const attempts = await this.attemptsService.getAttemptsForOneQuiz(quizId,studentId);
        return {quiz:{...quiz,configuration:this.getConfiguration(quiz.category)},attempts};
    }

    getQuizList(groupId:GROUPS,type:QUIZ_TYPE,role:UserRole){
        if(role==UserRole.ADMIN){
            return this.quizRepo
            .createQueryBuilder('quiz')
            .where('quiz.category = :groupId',{groupId})
            .andWhere('quiz.type = :type',{type})
            .getMany();    
        }

        return this.quizRepo
        .createQueryBuilder('quiz')
        .where('quiz.category = :groupId',{groupId})
        .andWhere('quiz.type = :type',{type})
        .andWhere('quiz.started = :started',{started:true})
        .getMany();
    }

    async getQuestionsAndAnswers(id:string){
        const quiz = await this.quizRepo
        .createQueryBuilder('quiz')
        .where('quiz.id = :id',{id})
        .leftJoinAndSelect('quiz.questions','questions')
        .leftJoinAndSelect('questions.choices','choices')
        .leftJoinAndSelect('questions.answer','answer')
        .leftJoinAndSelect('quiz.files','files')
        .orderBy('questions.isDeleted','DESC')
        .addOrderBy('questions.created_at','ASC')
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

    async attemptQuiz(quizId:string,userId:string,newAttempt:NewAttemptDto){
        const pastAttempt = await this.attemptsService.checkIfAlreadyAttempted(quizId,newAttempt.paperId,userId);
        if(pastAttempt?.id){
            throw new BadRequestException('Already attempted');
        }else{
            try{
                const attemptId = await this.attemptsService.createAttempt(quizId,newAttempt.paperId,userId);
                return {attemptId};
            }catch(err){
                throw new BadRequestException(err);
            }
        }
    }

    async hasAttemptAccess(quizId:string,userId:string){
        const quizData = await this.quizRepo.findOneOrFail({id:quizId});
        const requiredPlan = QUIZ_PLAN_MAP[quizData.category];
        const activeSubscriptions = await this.subscriptionsViewService.getActiveSubscription(userId,requiredPlan);
        if(activeSubscriptions.length==1){
            return true;
        }
        throw new ForbiddenException(`You need to purchase ${planTitles[requiredPlan]}`);
    }

    async addQuestion(id:string,question:NewQuestionDto,files:{'qimages[]':Express.Multer.File[],'choices[]':Express.Multer.File[]}):Promise<Question>{
        const quiz = await this.findOne(id);
        const newQuestion = new Question();
        newQuestion.questionContent = question.questionContent;
        newQuestion.quiz = quiz;
        newQuestion.paperId = question.paperId;
        newQuestion.sectionId = question.sectionId;
        
        const createdQuestionId = await this.questionService.addQuestion(newQuestion);
        let choices:string[];

        if(question.questionImages){
            const questionFiles = files['qimages[]'];
            const questionExtensions = questionFiles.map(f=>{
                const arr = f.originalname.split('.');
                console.log(arr);
                return arr[arr.length-1];
            });
            await this.s3UploaderService.uploadQuestionImages(questionFiles,createdQuestionId,questionExtensions);
            await this.questionService.updateQImages(questionExtensions,createdQuestionId);
        }
        if(question.optionImages){
            const choiceFiles = files['choices[]'];
            const choiceExtensions = choiceFiles.map(f=>{
                const arr = f.originalname.split('.');
                return arr[arr.length-1];
            });
            choices = await this.choiceService.insertChoices(choiceExtensions,createdQuestionId,true);
            await this.s3UploaderService.uploadChoiceImages(choiceFiles,choices,choiceExtensions);
        }else{
            choices = await this.choiceService.insertChoices(question.choices,createdQuestionId,false);
        }
        const answerChoice = choices[question.answer.charCodeAt(0) - 97];
        const newAnswer = new Answer();
        newAnswer.quizId = id;
        newAnswer.questionId = createdQuestionId;
        newAnswer.choiceId = answerChoice;
        newAnswer.paperId = question.paperId;
        await this.answerService.addAnswer(newAnswer);
        return this.questionService.getQuestion(createdQuestionId)
    }
    
}
