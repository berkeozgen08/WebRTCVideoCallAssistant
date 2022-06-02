import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, Observable, of } from 'rxjs';
import { CallService } from 'src/app/services/call.service';
import { MeetingService } from "src/app/services/meeting.service";

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss']
})
export class MeetingComponent implements OnDestroy, AfterViewInit, OnInit {

  title = 'WebRTCVideoCallAssistant.Client';

  @ViewChild('localVideo') localVideo: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo: ElementRef<HTMLVideoElement>;

  targetID: string = "";
  peerID: string;
  public isCallStarted$: Observable<boolean>;
  isUser:boolean;

  isMicOpen=true;
  isLocalCamOpen=true;
  isRemoteCamOpen=true;

  /**
   *
   */
  constructor(private callService: CallService,private route:ActivatedRoute, private meetingService: MeetingService, private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit(): void {
	const slug = this.route.snapshot.paramMap.get("slug");
    this.isCallStarted$ = this.callService.isCallStarted$;
    this.route.queryParams.subscribe({
      next:(params)=>{
		// TODO:
        // this.isUser = jwt.role == "user";
        this.isUser = params["a"] == "u";
		
		this.meetingService.resolveSlug(slug).subscribe({
			next: ({ userConnId, customerConnId }) => {
				if (this.isUser) {
					this.peerID = this.callService.initPeer(userConnId);
					of(this.callService.enableCallAnswer()).subscribe();
				} else {
					this.peerID = this.callService.initPeer(customerConnId);
					of(this.callService.establishMediaCall(userConnId)).subscribe();
				}
			},
			error: console.error
		});
      }
    });

    
  }

  ngAfterViewInit(): void {
    this.callService.localStream$
      .subscribe(stream => {
        if(!!stream){
          //this.isLocalCamOpen=true;
          this.localVideo.nativeElement.srcObject = stream
        }else{
          //this.isLocalCamOpen=false;
        }

        
        
      });

    this.callService.remoteStream$
      .subscribe(stream => {
        if(!!stream){
          //this.isRemoteCamOpen=true;

          this.remoteVideo.nativeElement.srcObject = stream;
        }else{
          //this.isRemoteCamOpen=false;
        }

        
      });
  }

  ngOnDestroy(): void {
    this.callService.destroyPeer();
  }

  showModal(join: boolean) {
    of(join ? this.callService.establishMediaCall(this.targetID) : this.callService.enableCallAnswer()).subscribe(_ => { });
  }

  public endCall() {
    this.callService.closeMediaCall();
  }

  toggleVideo(){
    this.isLocalCamOpen = !this.isLocalCamOpen;
    this.callService.localStream$.subscribe((stream) => {
      stream.getVideoTracks()[0].enabled = this.isLocalCamOpen;
      if (this.isLocalCamOpen) {
        this.changeDetector.detectChanges();
        this.localVideo.nativeElement.srcObject = stream;
      }
    });
  }
  
  toggleMicrophone(){
    this.isMicOpen = !this.isMicOpen;
    this.callService.localStream$.subscribe((stream) => stream.getAudioTracks()[0].enabled = this.isMicOpen);
  }

}
