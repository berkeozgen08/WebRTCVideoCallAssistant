import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Customer } from 'src/app/models/customer';
import { Meeting } from 'src/app/models/meeting';
import { User } from 'src/app/models/user';
import { CustomerService } from 'src/app/services/customer.service';
import { MeetingService } from 'src/app/services/meeting.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-set-meeting',
  templateUrl: './set-meeting.component.html',
  styleUrls: ['./set-meeting.component.scss']
})
export class SetMeetingComponent implements OnInit {

  meetingId: number
  isNewRecord: boolean;
  meeting: Meeting={
    id:0,
    createdAt:null,
    createdBy:null,
    createdFor:null,
    createdById:null,
    userConnId:null,
    customerConnId:null,
    slug:null,
    createdForId:null,
    startsAt:null,
    statId:null,
    stat:null
  };

  users:User[];
  customers:Customer[];

  constructor(
    private route: ActivatedRoute, 
    private meetingService: MeetingService, 
    private customerService:CustomerService,
    private userService:UserService,
    private toastService: ToastrService) { }

  ngOnInit(): void {
    let id = +this.route.snapshot.paramMap.get("id");
    this.isNewRecord = !(!!id);

    this.customerService.getAll().subscribe({
      next:(v)=>this.customers=v
    });

    this.userService.getAll().subscribe({
      next:(v)=>this.users=v
    });

    if (!this.isNewRecord) {
      this.meetingService.get(id).subscribe({
        next: (v) => this.meeting = v
      });
    }
  }

  onSubmit(): void {
    if (this.isNewRecord) {
      this.meetingService.create(this.meeting).subscribe({
        next: (v) => this.toastService.success(`Meeting created successfully.`),
        error: (err) => this.toastService.error(err)
      })

    } else {
      this.meetingService.update(this.meeting).subscribe({
        next: (v) => this.toastService.success(`Meeting updated successfully.`),
        error: (err) => this.toastService.error(err)
      });
    }
  }

  
}
