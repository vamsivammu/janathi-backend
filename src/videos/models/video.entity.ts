import { Chapter } from "src/chapters/models/chapter.entity";
import { Quiz } from "src/quiz/models/quiz.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Video{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    videoStorageId:string;

    @Column()
    name:string;

    @Column()
    description:string;
    
    @Column({default:false})
    isFree:boolean;

    @Column({nullable:true})
    thumbnail:string;

    @ManyToOne(()=>Chapter,(chapter:Chapter)=>chapter.videos)
    @JoinColumn()
    chapter:Chapter;

    @OneToOne(()=>Quiz,(quiz:Quiz)=>quiz.video)
    @JoinColumn()
    quiz:Quiz

}