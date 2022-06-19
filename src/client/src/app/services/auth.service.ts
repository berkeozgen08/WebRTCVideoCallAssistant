import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthUser } from '../models/auth';
import { Login } from '../models/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  isLogIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  userInfo$: BehaviorSubject<AuthUser> = new BehaviorSubject<AuthUser>(null);
  
  constructor(private http: HttpClient, private router: Router, private jwtHelper: JwtHelperService) {    
    
  }
  

  setLoggedIn(token:string):Observable<void>{
    localStorage.setItem(environment.ACCESS_TOKEN,token);

    //const token=localStorage.getItem(environment.ACCESS_TOKEN);
    
    const user= JSON.parse(token) as AuthUser;
    
    this.userInfo$.next(user);
    
    this.isLogIn$.next(true);
    return of(null);
  }

  isLoggedIn():Observable<boolean>{

    const token = localStorage.getItem(environment.ACCESS_TOKEN);

    if (!token) {
      this.isLogIn$.next(false);
    } else {

      let validToken = !this.jwtHelper.isTokenExpired(token);
      this.isLogIn$.next(validToken);

    }

    return this.isLogIn$.asObservable();
  }

  getUserInfo():Observable<AuthUser>{

    if(!!this.userInfo$){
    
      const token=localStorage.getItem(environment.ACCESS_TOKEN);
      const user= JSON.parse(token) as AuthUser;
      this.userInfo$.next(user);

    }

    return this.userInfo$.asObservable();
  }

  getUser(){
    const token = localStorage.getItem(environment.ACCESS_TOKEN);
    return this.jwtHelper.decodeToken(token) as AuthUser;
  }

  login(login: Login){
    return this.http.post<AuthUser>(`${environment.API_URL}Auth/SignIn`,login);
  }

  loginAdmin(login:Login){
    return this.http.post<AuthUser>(`${environment.API_URL}Auth/SignInAdmin`,login);
  }

  logout() {  
      localStorage.removeItem(environment.ACCESS_TOKEN);
      this.isLogIn$.next(false);
      this.userInfo$.next(null);
      //this.router.navigate(['/login']);
    
  }

}
