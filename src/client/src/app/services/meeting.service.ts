import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Meeting, MeetingCreate } from '../models/meeting';
import { Stat } from "../models/stat";

@Injectable({
  providedIn: 'root'
})
export class MeetingService {

  constructor(private http: HttpClient) { }

  public get(id: number) {
    return this.http.get<Meeting>(`${environment.API_URL}Meeting/Get/${id}`);
  }

  public getAll() {
    return this.http.get<Meeting[]>(`${environment.API_URL}Meeting/GetAll`);
  }

  public getAllByUser(userId:number) {
    return this.http.get<Meeting[]>(`${environment.API_URL}Meeting/GetAllByUser/${userId}`);
  }

  public create(meeting: MeetingCreate) {
    return this.http.put<Meeting>(`${environment.API_URL}Meeting/Create`, meeting);
  }

  public update(meeting: Meeting) {
    return this.http.patch(`${environment.API_URL}Meeting/Update/${meeting.id}`, meeting);
  }

  public delete(id: number) {
    return this.http.delete<Meeting>(`${environment.API_URL}Meeting/Delete/${id}`);
  }

  public resolveSlug(slug: string) {
    return this.http.get<Meeting>(`${environment.API_URL}Meeting/ResolveSlug/${slug}`);
  }

  public createStat(stats: any) {
	return this.http.put<Stat>(`${environment.API_URL}Stat/Create`, stats);
  }
}
