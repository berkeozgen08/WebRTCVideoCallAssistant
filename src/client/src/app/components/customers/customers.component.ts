import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer } from "../../models/customer";


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  customers: Customer[];

  constructor(private cusomerService: CustomerService,private toastService:ToastrService) { }

  ngOnInit(): void {

    this.cusomerService.getAll().subscribe(res => {
      this.customers = res;
    });

  }

  deleteCustomer(index:number){
    let customer=this.customers[index];

    this.cusomerService.delete(customer.id).subscribe({
      next:(v)=>{
        this.customers.splice(index,1);
        this.toastService.success("Customer deleted successfully");
      }
    });
  }

}
