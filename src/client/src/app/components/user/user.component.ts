import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private toastService: ToastrService) { }

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
    if (this.isNewRecord) {
      
      this.userService.create(this.user).subscribe({
        next: (v) => this.toastService.success(`Kullanıcı başarılı şekilde oluşturuldu.`),
        error: (err:Error) => this.toastService.error("Kullanıcı oluşturulamadı.")
      });

    } else {
      this.userService.update(this.user).subscribe({
        next: (v) => this.toastService.success(`Kullanıcı başarılı şekilde güncellendi.`),
        error: (err:Error) => this.toastService.error("Kullanıcı güncellenemedi.")
      });
    }
  }
}
