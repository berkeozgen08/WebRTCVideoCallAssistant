import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MeetingService } from 'src/app/services/meeting.service';

@Component({
  selector: 'app-meeting-end',
  templateUrl: './meeting-end.component.html',
  styleUrls: ['./meeting-end.component.scss']
})
export class MeetingEndComponent implements OnInit {




  endDate:string;

  constructor(private activatedRoute:ActivatedRoute,private meetingService:MeetingService) { }


  ngOnInit(): void {
      const slug=this.activatedRoute.snapshot.paramMap.get('slug');
      if(!!slug){
          this.meetingService.resolveSlug(slug).subscribe(v=>{
            this.endDate=v.stat.endedAt;
          })
                  
      }



  }

}
