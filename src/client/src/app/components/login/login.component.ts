import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthUser } from 'src/app/models/auth';
import { Login } from 'src/app/models/login';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  isloading: boolean = false;
  user: Login = {
    email: '',
    password: ''
  };
  title:'User Login'|'Admin Login'='User Login';

  isAdminLogin: boolean = false;

  constructor(
    private toastService: ToastrService,
    private authService: AuthService,
    private router: Router,
    private activeRoute: ActivatedRoute) {

  }

  ngOnInit(): void {

    this.isAdminLogin = (this.activeRoute.snapshot.url[0].path == 'admin-login');
    this.title=this.isAdminLogin?'Admin Login':'User Login';
  }

  login() {
    if (this.isAdminLogin) {
      
      this.authService.loginAdmin(this.user).subscribe({
        next:this.handleLogin,
        error:this.handleError
      })

    }else{
  
      this.authService.login(this.user).subscribe({
        next:this.handleLogin,
        error:this.handleError
      })

    }
    
  }


  handleLogin(value: AuthUser) {
    const token = JSON.stringify(value);

    localStorage.setItem(environment.ACCESS_TOKEN, token);
    this.authService.setLoggedIn();

    this.toastService.success("successfully logged in", "Login").onHidden.subscribe(() => {
      this.router.navigate(['/home']);
    });
  }

  handleError(err:Error){
    this.toastService.error(err.message, "Login");
  }
}
