import { Choice } from "src/choices/models/choice.entity";
import { SharedProps } from "src/helpers/sharedProps.helper";
import { PAPER } from "src/papers/dto/paper.enum";
import { Question } from "src/questions/models/question.entity";
import { Quiz } from "src/quiz/models/quiz.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Answer extends SharedProps{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({default:'No explanation'})
    reason:string;

    @OneToOne(()=>Choice)
    @JoinColumn({name:'choiceId'})
    choice:Choice;

    @Column()
    choiceId:string;

    @OneToOne(()=>Question,{onDelete:'CASCADE'})
    @JoinColumn({name:'questionId'})
    question:Question;

    @Column()
    questionId:string;

    @ManyToOne(()=>Quiz,(quiz:Quiz)=>quiz.answers)
    @JoinColumn({name:'quizId'})
    quiz:Quiz;

    @Column()
    quizId:string;

    @Column({nullable:true})
    paperId:PAPER;
}