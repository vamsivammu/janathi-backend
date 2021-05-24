import { Answer } from "src/answers/models/answer.entity";
import { Choice } from "src/choices/models/choice.entity";
import { SharedProps } from "src/helpers/sharedProps.helper";
import { Quiz } from "src/quiz/models/quiz.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Question extends SharedProps{
    
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    questionContent:string;

    @Column({type:'varchar',array:true,default: ()=>'array[]::varchar[]'})
    images:string[];

    @OneToMany(()=>Choice,(choice:Choice)=>choice.question)
    choices:Choice[];

    @Column({nullable:true})
    sectionId:string;

    @Column({nullable:true})
    paperId:string;

    @ManyToOne(()=>Quiz,(quiz:Quiz)=>quiz.questions)
    @JoinColumn({name:'quizId'})
    quiz:Quiz;

    @Column()
    quizId:string;

    @OneToOne(()=>Answer,(answer:Answer)=>answer.question)
    answer:Answer;

    
    
}