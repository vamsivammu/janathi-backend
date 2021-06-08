import { SharedProps } from "src/helpers/sharedProps.helper";
import { PAPER } from "src/papers/dto/paper.enum";
import { Quiz } from "src/quiz/models/quiz.entity";
import { Response } from "src/responses/models/response.entity";
import { User } from "src/user/models/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Attempt extends SharedProps{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ManyToOne(()=>User,(user:User)=>user.attempts)
    @JoinColumn()
    user:User;

    @Column()
    userId:string;

    @ManyToOne(()=>Quiz,(quiz:Quiz)=>quiz.attempts)
    @JoinColumn()
    quiz:Quiz;

    @Column()
    quizId:string;

    @Column({nullable:true})
    paperId:PAPER;

    @Column({default:false})
    completed:boolean;

    @Column({default:0})
    score:number;

    @OneToMany(()=>Response,(response:Response)=>response.attempt)
    responses:Response[];
}