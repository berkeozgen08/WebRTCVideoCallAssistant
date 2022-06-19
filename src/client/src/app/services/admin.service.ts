import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Admin, AdminUpdate } from '../models/admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  public get(id: number) {
    return this.http.get<Admin>(`${environment.API_URL}Admin/Get/${id}`);
  }

  public getAll() {
    return this.http.get<Admin[]>(`${environment.API_URL}Admin/GetAll`);
  }

  public create(admin: Admin) {
    return this.http.put<Admin>(`${environment.API_URL}Admin/Create`, admin);
  }

  public update(admin: Admin) {
    const adminUpdate: AdminUpdate = { password: admin.password };
    return this.http.patch(`${environment.API_URL}Admin/Update/${admin.id}`, adminUpdate);
  }

  public delete(id: number) {
    return this.http.delete<Admin>(`${environment.API_URL}Admin/Delete/${id}`);
  }




}
