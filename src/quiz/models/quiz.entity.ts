import { Answer } from "src/answers/models/answer.entity";
import { Attempt } from "src/attempts/models/attempt.entity";
import { SharedProps } from "src/helpers/sharedProps.helper";
import { Question } from "src/questions/models/question.entity";
import { Section } from "src/sections/models/section.entity";
import { Video } from "src/videos/models/video.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { QUIZ_TYPE } from "./quiz.interface";

@Entity()
export class Quiz extends SharedProps{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name:string

    @Column()
    description:string;

    @Column({default:QUIZ_TYPE.DAILY})
    type:QUIZ_TYPE

    @Column({default:3600})
    duration:number;

    @OneToMany(()=>Question,(question:Question)=>question.quiz)
    questions:Question[];

    @OneToMany(()=>Attempt,(attempt:Attempt)=>attempt.quiz)
    attempts:Attempt[];

    @OneToMany(()=>Answer,(answer:Answer)=>answer.quiz)
    answers:Answer[];

    @OneToOne(()=>Video,(video:Video)=>video.quiz)
    video:Video;

    @OneToMany(()=>Section,(section:Section)=>section.quiz)
    sections:Section[];
    
}