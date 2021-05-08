import { UserRole } from "src/user/models/user.interface";

export interface IUserAuthentication{
    email:string,
    password:string
}

export interface IUserSignup{
    name:string,
    password:string,
    mobile:string,
    email:string
}

export interface IUserAuthorization{
    token:string
}

export interface IUserBody{
    id:string,
    email:string,
    name:string,
    role:UserRole,
}