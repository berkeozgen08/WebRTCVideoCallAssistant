import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/models/customer';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
	selector: 'app-customer',
	templateUrl: './customer.component.html',
	styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
	customer: Customer = {
		id: 0,
		firstName: '',
		lastName: '',
		phone: '',
		email: ''
	};
	isNewRecord: boolean;
	isloading: boolean = false;

	constructor(
		private customerService: CustomerService,
		private route: ActivatedRoute,
		private toastService: ToastrService,
		private router: Router
	) { }

	ngOnInit(): void {
		let id = +this.route.snapshot.paramMap.get("id");
		this.isNewRecord = !(!!id);
		if (!this.isNewRecord) {
			this.customerService.get(id).subscribe({
				next: (v) => this.customer = v
			})
		}
	}

	onSubmit(): void {
		this.isloading = true;
		if (this.isNewRecord) {
			this.customerService.create(this.customer).subscribe({
				next: (v) => {
					this.router.navigate(["/"]);
					this.toastService.success(`Müşteri başarıyla oluşturuldu.`)
				},
				error: (err) => {
					this.toastService.error(err?.error?.message || err?.error?.title + "</br>" + Object.values(err?.error?.errors || {})?.reduce((acc, i) => acc + (i as any).reduce((acc2, j) => acc + j + " ") + "</br>", ""), "", { enableHtml: true });
					this.isloading = false;
				}
			})

		} else {
			this.customerService.update(this.customer).subscribe({
				next: (v) => {
					this.router.navigate(["/"]);
					this.toastService.success(`Müşteri başarıyla güncellendi.`)
				},
				error: (err) => {
					this.toastService.error(err?.error?.message || err?.error?.title + "</br>" + Object.values(err?.error?.errors || {})?.reduce((acc, i) => acc + (i as any).reduce((acc2, j) => acc + j + " ") + "</br>", ""), "", { enableHtml: true });
					this.isloading = false;
				}
			});
		}
	}
}
