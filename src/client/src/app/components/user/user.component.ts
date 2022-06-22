import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
	user: User = {
		id: 0,
		firstName: '',
		lastName: '',
		password: '',
		email: '',
		phone: ''
	}
	isNewRecord: boolean;
	isloading: boolean = false;

	constructor(
		private userService: UserService,
		private route: ActivatedRoute,
		private toastService: ToastrService,
		private router: Router
	) {}

	ngOnInit(): void {
		let id = +this.route.snapshot.paramMap.get("id");
		this.isNewRecord = !(!!id);
		if (!this.isNewRecord) {
			this.userService.get(id).subscribe({
				next: (v) => {
					v.password = null
					this.user = v
				}
			})
		}
	}

	onSubmit(): void {
		this.isloading = true;
		if (this.isNewRecord) {
			this.userService.create(this.user).subscribe({
				next: (v) => {
					this.router.navigate(["/"]);
					this.toastService.success(`Kullanıcı başarıyla oluşturuldu.`)
				},
				error: (err) => {
					this.toastService.error(err?.error?.message || err?.error?.title + "</br>" + Object.values(err?.error?.errors || {})?.reduce((acc, i) => acc + (i as any).reduce((acc2, j) => acc + j + " ") + "</br>", ""), "", { enableHtml: true });
					this.isloading = false;
				}
			});
		} else {
			this.userService.update(this.user).subscribe({
				next: (v) => {
					this.router.navigate(["/"]);
					this.toastService.success(`Kullanıcı başarıyla güncellendi.`)
				},
				error: (err) => {
					this.toastService.error(err?.error?.message || err?.error?.title + "</br>" + Object.values(err?.error?.errors || {})?.reduce((acc, i) => acc + (i as any).reduce((acc2, j) => acc + j + " ") + "</br>", ""), "", { enableHtml: true });
					this.isloading = false;
				}
			});
		}
	}
}
