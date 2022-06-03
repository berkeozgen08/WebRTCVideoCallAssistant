import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Meeting } from 'src/app/models/meeting';
import { MeetingService } from 'src/app/services/meeting.service';
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  itemsCountOptions = [10, 20, 50, 100];
  itemsPerPage: number = this.itemsCountOptions[1];
  currentPage = 1;
  meetings: Meeting[] = [];
  isloading: boolean = false;
  constructor(
    private meetingService: MeetingService,
    private toastService: ToastrService) { }

  ngOnInit(): void {
    this.isloading = true;
    this.meetingService.getAll().subscribe({
      next: (v) => {
        this.meetings = v;
        this.isloading = false;
      }
    });
  }

  get id(): string {
    return uuidv4();
  }


  getInviteLink(data: string) {
    navigator.clipboard.writeText(`${window.location.toString()}j/${data}`);
	this.toastService.success(`Invite link copied to clipboard.\n${data}`)
  }

  deleteMeeting(index: number) {
    let absoluteIndex = this.itemsPerPage * (this.currentPage - 1) + index;
    let meeting = this.meetings[absoluteIndex];

    this.meetingService.delete(meeting.id).subscribe({
      next: (v) => {
        this.meetings.splice(absoluteIndex, 1);
        this.toastService.success("Meeting deleted successfully");
      }
    });
  }

}
