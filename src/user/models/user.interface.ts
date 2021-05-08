export enum UserRole{
    ADMIN = 'ADMIN',
    USER = 'USER',
    BRONZE = 'BRONZE',
    SILVER = 'SILVER',
    GOLD = 'GOLD'
};

export interface IUser{
    id:string,
    name:string,
    email:string,
    mobile:string,
    password:string,
    role:UserRole
}
