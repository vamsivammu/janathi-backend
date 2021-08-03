import { Video } from "src/videos/models/video.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { GROUPS, VIDEO_GROUPS } from "./chapters.interface";

@Entity()
export class Chapter{
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name:string;

    @Column()
    description:string;

    @Column({default:''})
    imgExt:string;

    @Column()
    groupId:VIDEO_GROUPS;

    @OneToMany(()=>Video,(video:Video)=>video.chapter)
    videos:Video[];


}