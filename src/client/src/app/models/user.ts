export interface User {
    id:number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
}

export interface UserUpdate{
    password:string;
    phone:string;
}