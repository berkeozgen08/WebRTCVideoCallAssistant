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

  users:User[];
  constructor(
    private userService:UserService,
    private toastService:ToastrService) { }

  ngOnInit(): void {
    this.userService.getAll().subscribe({
      next:(res)=>{
        this.users=res;
      }
    });

  }

  deleteUser(index:number){
    let user=this.users[index];

    this.userService.delete(user.id).subscribe({
      next:(v)=>{
        this.users.splice(index,1);
        this.toastService.success("Customer deleted successfully");
      }
    });
  }

}
