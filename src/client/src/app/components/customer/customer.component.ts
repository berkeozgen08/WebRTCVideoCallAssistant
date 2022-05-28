import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private toastService: ToastrService
  ) {

  }

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
    if (this.isNewRecord) {
      this.customerService.create(this.customer).subscribe({
        next: (v) =>this.toastService.success(`Customer created successfully.`),
        error: (err) => this.toastService.error(err)
      })

    } else {
      this.customerService.update(this.customer).subscribe({
        next: (v) =>this.toastService.success(`Customer updated successfully.`),
        error: (err) => this.toastService.error(err)
      });
    }
  }

}
