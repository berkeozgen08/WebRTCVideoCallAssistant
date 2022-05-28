import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meeting } from 'src/app/models/meeting';
import { MeetingService } from 'src/app/services/meeting.service';

@Component({
  selector: 'app-meeting-stats',
  templateUrl: './meeting-stats.component.html',
  styleUrls: ['./meeting-stats.component.scss']
})
export class MeetingStatsComponent implements OnInit {

  meeting:Meeting;
  constructor(
    private meetingService:MeetingService,
    private route:ActivatedRoute
    ) { }

  ngOnInit(): void {
    let id=+this.route.snapshot.paramMap.get("id");
    this.meetingService.get(id).subscribe({
      next:(v)=>this.meeting=v
    });

    
  }

}
