import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import { User, UserUpdate } from "src/app/models/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public get(id: number) {
    return this.http.get<User>(`${environment.API_URL}User/Get/${id}`);
  }

  public getAll() {
    return this.http.get<User[]>(`${environment.API_URL}User/GetAll`);
  }

  public create(user: User) {
    return this.http.put<User>(`${environment.API_URL}User/Create`, user);
  }

  public update(user: User) {
    let update: UserUpdate = { password: user.password, phone: user.phone }
    return this.http.patch(`${environment.API_URL}User/Update/${user.id}`, update);//we user in body id unnecessary
  }

  public delete(id: number) {
    return this.http.delete<User>(`${environment.API_URL}User/Delete/${id}`);
  }


}
