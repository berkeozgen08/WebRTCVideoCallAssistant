import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { delay } from 'rxjs';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from "../../models/customer";

@Component({
	selector: 'app-customers',
	templateUrl: './customers.component.html',
	styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
	itemsCountOptions = [10, 20, 50, 100];
	itemsPerPage: number = this.itemsCountOptions[0];
	currentPage = 1;
	customers: Customer[] = [];
	isloading: boolean = false;

	constructor(
		private cusomerService: CustomerService,
		private toastService: ToastrService
	) {}

	ngOnInit(): void {
		this.isloading = true;
		this.cusomerService.getAll().subscribe(res => {
			this.customers = res;
			this.isloading = false;
		});
	}

	deleteCustomer(index: number) {

		let absoluteIndex = this.itemsPerPage * (this.currentPage - 1) + index;
		let customer = this.customers[absoluteIndex];
		this.cusomerService.delete(customer.id).subscribe({
			next: (v) => {
				this.customers.splice(absoluteIndex, 1);
				this.toastService.success("Müşteri başarıyla silindi.");
			},
			error: (err) => this.toastService.error(err?.error?.message || err?.error?.title + "</br>" + Object.values(err?.error?.errors || {})?.reduce((acc, i) => acc + (i as any).reduce((acc2, j) => acc + j + " ") + "</br>", ""), "", { enableHtml: true })
		});
	}
}
