import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Admin } from 'src/app/models/admin';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit {

  itemsCountOptions = [10, 20, 50, 100];
  itemsPerPage: number = this.itemsCountOptions[0];
  currentPage = 1;
  admins:Admin[]=[];
  isloading:boolean=false;

  constructor(private toastService:ToastrService,private adminService:AdminService) { 

  }

  ngOnInit(): void {
    this.isloading=true;
    this.adminService.getAll().subscribe({
      next:(res)=>{
        this.admins=res;
        this.isloading=false;
      }
    });
  }

  deleteAdmin(index:number){
  
    let absoluteIndex=this.itemsPerPage*(this.currentPage-1)+index;
    let admin=this.admins[absoluteIndex];

    this.adminService.delete(admin.id).subscribe({
      next:(v)=>{
        this.admins.splice(absoluteIndex,1);
        this.toastService.success("Yönetici başarılı şekilde silindi.");
      }
    });
  }

}
