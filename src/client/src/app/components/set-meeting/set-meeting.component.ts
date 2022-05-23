import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-set-meeting',
  templateUrl: './set-meeting.component.html',
  styleUrls: ['./set-meeting.component.scss']
})
export class SetMeetingComponent implements OnInit {
  
  meetingId:number

  constructor(private route:ActivatedRoute) { }

  ngOnInit(): void {
    
    this.route.queryParams.subscribe({
      next:(params)=>{
        this.meetingId=(params['meetingId'])
        
      }
    });
    
  }

}
