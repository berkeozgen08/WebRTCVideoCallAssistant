import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {


  itemsCountOptions = [10, 20, 50, 100];
  itemsPerPage: number = this.itemsCountOptions[0];
  currentPage = 1;
  users:User[]=[];
  isloading:boolean=false;
  constructor(
    private userService:UserService,
    private toastService:ToastrService
    ) { }

  ngOnInit(): void {
    this.isloading=true;
    this.userService.getAll().subscribe({
      next:(res)=>{
        this.users=res;
        this.isloading=false;
      }
    });

  }

  deleteUser(index:number){
    let absoluteIndex=this.itemsPerPage*(this.currentPage-1)+index;
    let user=this.users[absoluteIndex];

    this.userService.delete(user.id).subscribe({
      next:(v)=>{
        this.users.splice(absoluteIndex,1);
        this.toastService.success("Customer deleted successfully");
      }
    });
  }

}
