import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthUser } from 'src/app/models/auth';
import { Login, LoginAdmin } from 'src/app/models/login';
import { AuthService } from 'src/app/services/auth.service';

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
	title: 'Çalışan Girişi' | 'Yönetici Girişi' = 'Çalışan Girişi';

	isAdminLogin: boolean = false;

	constructor(
		private toastService: ToastrService,
		private authService: AuthService,
		private router: Router,
		private activeRoute: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.isAdminLogin = (this.activeRoute.snapshot.url[0].path == 'admin-login');
		this.title = this.isAdminLogin ? 'Yönetici Girişi' : 'Çalışan Girişi';
	}

	login() {
		this.isloading = true;
		if (this.isAdminLogin) {
			this.authService.loginAdmin({ username: this.user.email, password: this.user.password } as LoginAdmin).subscribe({
				next: (value: AuthUser) => {
					const token = JSON.stringify(value);
					this.authService.setLoggedIn(token).subscribe(v => {
						this.isloading = false;
						this.toastService.success("Yönetici başarılı şekilde oturum açtı.");
						this.router.navigate(['/admins']);
					});
				},
				error: (err: Error) => {
					this.isloading = false;
					this.toastService.error("Oturum açılamadı");
				}
			})
		} else {
			this.authService.login(this.user).subscribe({
				next: (value: AuthUser) => {
					const token = JSON.stringify(value);
					this.authService.setLoggedIn(token).subscribe(v => {
						this.isloading = false;
						this.toastService.success("Çalışan başarılı şekilde oturum açtı.");
						this.router.navigate(['/home']);
					})
				},
				error: (err: Error) => {
					this.isloading = false;
					this.toastService.error("Oturum açılamadı");
				}
			})
		}
	}

	handleLogin(value: AuthUser) {

	}

	handleError(err: any) {

	}
}
