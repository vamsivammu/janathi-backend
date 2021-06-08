import { GROUPS } from "src/chapters/models/chapters.interface";


export enum GROUP_EXAMS{
    GROUP1_PRELIMS = 'Group-1 Prelims',
    GROUP1_MAINS = 'Group-1 Mains',
    GROUP2_PRELIMS = 'Group-2 Prelims',
    GROUP2_MAINS = 'Group-2 Mains',
    SI_PRELIMS = 'S.I Prelims',
    SI_MAINS = 'S.I Mains',
    CONSTABLE_PRELIMS = 'Constable Prelims',
    CONSTABLE_MAINS = 'Constable Mains'
}

export enum PAPER{
    PAPER1 = 'Paper 1',
    PAPER2 = 'Paper 2',
    PAPER3 = 'Paper 3',
    PAPER4 = 'Paper 4',
    PAPER5 = 'Paper 5'
}

export const PaperConfig = {
    [GROUPS.CONSTABLE] :null,
    [GROUPS.SI]:null,
    [GROUPS.GROUP1]:[PAPER.PAPER1,PAPER.PAPER2],
    [GROUPS.GROUP2]:[PAPER.PAPER1,PAPER.PAPER2,PAPER.PAPER3]
};


export enum GROUP2_P2_SECTIONS{
    SECTION1 = 'Polity',
    SECTION2 = 'History'
}

export enum GROUP2_P3_SECTIONS{
    SECTION1 = 'A.P Economy',
    SECTION2 = 'Indian Economy'
}

export enum GROUP1_MAINS_P1{
    SECTION1 = 'Section 1',
    SECTION2 = 'Section 2',
    SECTION3 = 'Section 3'
}

export enum GROUP1_MAINS_P2{
    SECTION1 = 'Section 1',
    SECTION2 = 'Section 2',
    SECTION3 = 'Section 3'
}

export enum GROUP1_MAINS_P3{
    SECTION1 = 'Section 1',
    SECTION2 = 'Section 2',
    SECTION3 = 'Section 3'
}

export enum GROUP1_MAINS_P4{
    SECTION1 = 'Section 1',
    SECTION2 = 'Section 2',
}

export enum GROUP1_MAINS_P5{
    SECTION1 = 'Section 1',
    SECTION2 = 'Section 2',
    SECTION3 = 'Section 3'
}

export const SectionConfig = {
    [GROUP_EXAMS.CONSTABLE_MAINS]:null,
    [GROUP_EXAMS.CONSTABLE_PRELIMS]:null,
    [GROUP_EXAMS.SI_MAINS]:null,
    [GROUP_EXAMS.SI_PRELIMS]:null,
    [GROUPS.GROUP2]:{
        [PAPER.PAPER1]:null,
        [PAPER.PAPER2]:[GROUP2_P2_SECTIONS.SECTION1,GROUP2_P2_SECTIONS.SECTION2],
        [PAPER.PAPER3]:[GROUP2_P3_SECTIONS.SECTION1,GROUP2_P3_SECTIONS.SECTION2]
    },
    [GROUP_EXAMS.GROUP1_PRELIMS]:null,
    [GROUP_EXAMS.GROUP1_MAINS]:{
        [PAPER.PAPER1]:[GROUP1_MAINS_P1.SECTION1,GROUP1_MAINS_P1.SECTION2,GROUP1_MAINS_P1.SECTION3],
        [PAPER.PAPER2]:[GROUP1_MAINS_P2.SECTION1,GROUP1_MAINS_P2.SECTION2,GROUP1_MAINS_P2.SECTION3],
        [PAPER.PAPER3]:[GROUP1_MAINS_P3.SECTION1,GROUP1_MAINS_P3.SECTION2,GROUP1_MAINS_P3.SECTION3],
        [PAPER.PAPER4]:[GROUP1_MAINS_P4.SECTION1,GROUP1_MAINS_P4.SECTION2],
        [PAPER.PAPER5]:[GROUP1_MAINS_P5.SECTION1,GROUP1_MAINS_P5.SECTION2,GROUP1_MAINS_P5.SECTION3]
    }

};