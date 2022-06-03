import { Customer } from "./customer";
import { Stat } from "./stat";
import { User } from "./user";

export interface Meeting {
    id: number;
    createdById: number;
    createdForId: number;
	userConnId: string;
	customerConnId: string;
    slug: string;
    startsAt: string;
    createdAt: string;
    statId:number;
    stat:Stat;
    createdBy:User;
    createdFor:Customer;
}

export interface MeetingCreate {
    createdById: number;
    createdForId: number;
    startsAt: string;
}
