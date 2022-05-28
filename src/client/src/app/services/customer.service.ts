import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { Customer } from '../models/customer';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  
  constructor(private http: HttpClient) {

  }

  public get(id:number){
    return this.http.get<Customer>(`${environment.API_URL}Customer/Get/${id}`);
  }

  public getAll(){
    return this.http.get<Customer[]>(`${environment.API_URL}Customer/GetAll`);
  }

  public create(customer:Customer){
    return this.http.put<Customer>(`${environment.API_URL}Customer/Create`,customer);
  }

  public update(customer:Customer){
    return this.http.patch(`${environment.API_URL}Customer/Update/${customer.id}`,customer);//we customer in body id unnecessary
  }

  public delete(id:number){
    return this.http.delete<Customer>(`${environment.API_URL}Customer/Delete/${id}`);
  }

}
