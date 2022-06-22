import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Admin } from 'src/app/models/admin';
import { AdminService } from 'src/app/services/admin.service';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
	isNewRecord: boolean;
	admin: Admin = {
		id: 0,
		username: '',
		password: ''
	};
	isloading: boolean = false;
	
	constructor(
		private adminService: AdminService,
		private route: ActivatedRoute,
		private toastService: ToastrService,
		private router: Router
	) {}

	ngOnInit(): void {
		const id = +this.route.snapshot.paramMap.get("id");
		this.isNewRecord = !(!!id);
		if (!this.isNewRecord) {
			this.adminService.get(id).subscribe({
				next: (v) => {
					v.password = null
					this.admin = v
				}
			});
		}
	}

	onSubmit(): void {
		this.isloading = true;
		if (this.isNewRecord) {
			this.adminService.create(this.admin).subscribe({
				next: (v) => {
					this.router.navigate(["/"]);
					this.toastService.success(`Yönetici başarılı şekilde oluşturuldu.`)
				},
				error: (err) => this.toastService.error(err?.error?.message),
				complete: () => this.isloading = false
			});

		} else {
			this.adminService.update(this.admin).subscribe({
				next: (v) => {
					this.router.navigate(["/"]);
					this.toastService.success(`Yönetici başarılı şekilde güncellendi.`)
				},
				error: (err) => this.toastService.error(err?.error?.message),
				complete: () => this.isloading = false
			});
		}
	}

}
