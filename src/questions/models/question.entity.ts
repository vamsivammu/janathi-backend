import { Answer } from "src/answers/models/answer.entity";
import { Choice } from "src/choices/models/choice.entity";
import { SharedProps } from "src/helpers/sharedProps.helper";
import { Quiz } from "src/quiz/models/quiz.entity";
import { Section } from "src/sections/models/section.entity";
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

    @ManyToOne(()=>Section,(section:Section)=>section.questions)
    @JoinColumn({name:'sectionId'})
    section:Section;

    @Column()
    sectionId:string;

    @ManyToOne(()=>Quiz,(quiz:Quiz)=>quiz.questions)
    @JoinColumn({name:'quizId'})
    quiz:Quiz;

    @Column()
    quizId:string;

    @OneToOne(()=>Answer,(answer:Answer)=>answer.question)
    answer:Answer;

    
}