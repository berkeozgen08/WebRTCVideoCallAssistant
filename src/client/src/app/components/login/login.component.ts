import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  title: 'User Login' | 'Admin Login' = 'User Login';

  isAdminLogin: boolean = false;

  constructor(
    private toastService: ToastrService,
    private authService: AuthService,
    private router: Router,
    private activeRoute: ActivatedRoute) {

  }

  ngOnInit(): void {

    this.isAdminLogin = (this.activeRoute.snapshot.url[0].path == 'admin-login');
    this.title = this.isAdminLogin ? 'Admin Login' : 'User Login';
  }

  login() {
    if (this.isAdminLogin) {

      this.authService.loginAdmin(this.user).subscribe({
        next: (value: AuthUser) => {
          const token = JSON.stringify(value);

          this.authService.setLoggedIn(token).subscribe(v => {

            this.toastService.success("successfully logged in", "Login");
            this.router.navigate(['/home']);

          });

        },
        error: (err: Error) => {
          this.toastService.error(err.message, "Login");
        }
      })

    } else {

      this.authService.login(this.user).subscribe({
        next: (value: AuthUser) => {
          const token = JSON.stringify(value);
          this.authService.setLoggedIn(token).subscribe(v => {
            this.toastService.success("successfully logged in", "Login");
            this.router.navigate(['/home']);
          })

        },
        error: (err: Error) => {
          this.toastService.error(err.message, "Login");
        }
      })

    }

  }

  handleLogin(value: AuthUser) {


  }

  handleError(err: any) {

  }
}
