import { GROUPS } from "src/chapters/models/chapters.interface";

export enum PAPER{
    PAPER1 = 'Paper 1',
    PAPER2 = 'Paper 2',
    PAPER3 = 'Paper 3'
};

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

export const SectionConfig = {
    [GROUPS.CONSTABLE]:null,
    [GROUPS.SI]:null,
    [GROUPS.GROUP1]:{
        [PAPER.PAPER1]:null,
        [PAPER.PAPER2]:null
    },
    [GROUPS.GROUP2]:{
        [PAPER.PAPER1]:null,
        [PAPER.PAPER2]:[GROUP2_P2_SECTIONS.SECTION1,GROUP2_P2_SECTIONS.SECTION2],
        [PAPER.PAPER3]:[GROUP2_P3_SECTIONS.SECTION1,GROUP2_P3_SECTIONS.SECTION2]
    }
};