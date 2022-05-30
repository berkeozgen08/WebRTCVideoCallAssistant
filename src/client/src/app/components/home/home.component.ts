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
  itemsPerPage: number = this.itemsCountOptions[0];
  currentPage = 1;
  meetings: Meeting[] = [];

  constructor(private meetingService: MeetingService, private toastService: ToastrService) { }

  ngOnInit(): void {
    this.meetingService.getAll().subscribe({
      next: (v) => {
        this.meetings = v;

      }
    });
  }

  get id(): string {
    return uuidv4();
  }

  getInviteLink(data: string) {
    navigator.clipboard.writeText(data);
  }

  deleteMeeting(index: number) {
    let meeting = this.meetings[index];

    this.meetingService.delete(meeting.id).subscribe({
      next: (v) => {
        this.meetings.splice(index, 1);
        this.toastService.success("Meeting deleted successfully");
      }
    });
  }

}
