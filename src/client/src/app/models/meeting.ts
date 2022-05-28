import { Customer } from "./customer";
import { Stat } from "./stat";
import { User } from "./user";

export interface Meeting {
    id: number;
    createdBy: number;
    createdFor: number;
    userSlug: string;
    customerSlug: string;
    startsAt: string;
    createdAt: string;
    statId:number;
    stat:Stat;
    createdByNavigation:User;
    createdForNavigation:Customer;
    
}

export interface MeetingCreate {
    createdBy: number;
    createdFor: number;
    startsAt: string;
}