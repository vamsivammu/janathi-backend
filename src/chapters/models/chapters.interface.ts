export enum GROUPS{
    GROUP1 = 'Group 1',
    GROUP2 = 'Group 2',
    SI = 'S.I',
    CONSTABLE = 'Constable'
}

export interface INewChapter{
    name:string,
    description:string,
    groupId:GROUPS
}