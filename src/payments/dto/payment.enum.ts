import { GROUPS, VIDEO_GROUPS } from "src/chapters/models/chapters.interface";

// export enum Plans{
//     QUIZ_PLAN = 'Quiz Plan',
//     VIDEO_PLAN = 'All Videos Plan',
//     GROUPS_PLAN = 'Group 1,2 Videos Plan',
//     SI_PLAN = 'SI Videos Plan',
//     CONSTABLE_PLAN = 'Constable Videos Plan'
// };
export enum Plans {
    G1_QUIZ_PLAN='G1_QUIZ_PLAN',
    G2_QUIZ_PLAN='G2_QUIZ_PLAN',
    SI_QUIZ_PLAN='SI_QUIZ_PLAN',
    CONSTABLE_QUIZ_PLAN='CONSTABLE_QUIZ_PLAN',
    G12_VIDEO_PLAN='G1_VIDEO_PLAN',
    SI_VIDEO_PLAN='SI_VIDEO_PLAN',
    CONSTABLE_VIDEO_PLAN='CONSTABLE_VIDEO_PLAN'
};

export const VideoPlanAccess = {
    [Plans.G12_VIDEO_PLAN]:[VIDEO_GROUPS.GROUP12],
    [Plans.SI_VIDEO_PLAN]:[VIDEO_GROUPS.SI],
    [Plans.CONSTABLE_VIDEO_PLAN]:[VIDEO_GROUPS.CONSTABLE]
};

export const QuizPlanAccess = {
    [Plans.G1_QUIZ_PLAN]:[GROUPS.GROUP1],
    [Plans.G2_QUIZ_PLAN]:[GROUPS.GROUP2],
    [Plans.SI_QUIZ_PLAN]:[GROUPS.SI],
    [Plans.CONSTABLE_QUIZ_PLAN]:[GROUPS.CONSTABLE]
};


export const planPrices = {
    G1_QUIZ_PLAN:{price:1999,period:'Year'},
    G2_QUIZ_PLAN:{price:2999,period:'Year'},
    SI_QUIZ_PLAN:{price:1999,period:'Year'},
    CONSTABLE_QUIZ_PLAN:{price:999,period:'Year'},
    G1_VIDEO_PLAN:{price:799,period:'Month'},
    SI_VIDEO_PLAN:{price:399,period:'Month'},
    CONSTABLE_VIDEO_PLAN:{price:399,period:'Month'}
};

export const planTitles = {
    G1_QUIZ_PLAN:'Group 1 Quiz Plan',
    G2_QUIZ_PLAN:'Group 2 Quiz Plan',
    SI_QUIZ_PLAN:'S.I Quiz Plan',
    CONSTABLE_QUIZ_PLAN:'Constable Quiz Plan',
    G1_VIDEO_PLAN:'Group 1,2 Video Plan',
    SI_VIDEO_PLAN:'S.I Video Plan',
    CONSTABLE_VIDEO_PLAN:'Constable Video Plan'
};

export const VIDEO_PLAN_MAP = {
    [VIDEO_GROUPS.GROUP12]:Plans.G12_VIDEO_PLAN,
    [VIDEO_GROUPS.SI]:Plans.SI_VIDEO_PLAN,
    [VIDEO_GROUPS.CONSTABLE]:Plans.CONSTABLE_VIDEO_PLAN
};

export const QUIZ_PLAN_MAP = {
    [GROUPS.GROUP1]:Plans.G1_QUIZ_PLAN,
    [GROUPS.GROUP2]:Plans.G2_QUIZ_PLAN,
    [GROUPS.SI]:Plans.SI_QUIZ_PLAN,
    [GROUPS.CONSTABLE]:Plans.CONSTABLE_QUIZ_PLAN
}