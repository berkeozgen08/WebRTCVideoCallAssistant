import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router,private jwtHelper:JwtHelperService) {


  }

  canActivate(): boolean {
    const token = localStorage.getItem(environment.ACCESS_TOKEN);
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    } else {
      let validToken=!this.jwtHelper.isTokenExpired(token);
      return validToken;
    }
  }
  
}
