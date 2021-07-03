import { GROUPS } from "src/chapters/models/chapters.interface";

export enum Plans{
    QUIZ_PLAN = 'Quiz Plan',
    VIDEO_PLAN = 'All Videos Plan',
    GROUPS_PLAN = 'Group 1,2 Videos Plan',
    SI_PLAN = 'SI Videos Plan',
    CONSTABLE_PLAN = 'Constable Videos Plan'
};

export const Pricing = {
    [Plans.QUIZ_PLAN]:999,
    [Plans.VIDEO_PLAN]:2499,
    [Plans.GROUPS_PLAN]:999,
    [Plans.SI_PLAN]:999,
    [Plans.CONSTABLE_PLAN]:999,    
};

export const VideoPlanAccess = {
    [Plans.VIDEO_PLAN]:[GROUPS.GROUP1,GROUPS.GROUP2,GROUPS.SI,GROUPS.CONSTABLE],
    [Plans.GROUPS_PLAN]:[GROUPS.GROUP1,GROUPS.GROUP2],
    [Plans.SI_PLAN]:[GROUPS.SI],
    [Plans.CONSTABLE_PLAN]:[GROUPS.CONSTABLE]
};