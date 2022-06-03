import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Meeting, MeetingCreate } from '../models/meeting';

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

  public create(meeting: MeetingCreate) {
    return this.http.put<Meeting>(`${environment.API_URL}Meeting/Create`, meeting);
  }

  public update(meeting: Meeting) {
    //let update: MeetingUpdate = { password: meeting.password, phone: Meeting.phone }
    return this.http.patch(`${environment.API_URL}Meeting/Update/${meeting.id}`, meeting);//we Meeting in body id unnecessary
  }

  public delete(id: number) {
    return this.http.delete<Meeting>(`${environment.API_URL}Meeting/Delete/${id}`);
  }

  public resolveSlug(slug: string) {
    return this.http.get<Meeting>(`${environment.API_URL}Meeting/ResolveSlug/${slug}`);
  }
}
