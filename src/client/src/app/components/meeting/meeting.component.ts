import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, Observable, of } from 'rxjs';
import { PeerData } from 'src/app/models/data';
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
  isUser: boolean;


  isMicOpen = true;
  isLocalCamOpen = true;
  isRemoteCamOpen = true;
  isRemoteMicOpen = true;

  /**
   *
   */
  constructor(private callService: CallService,private route:ActivatedRoute, private meetingService: MeetingService,private cdr:ChangeDetectorRef) {
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
      .subscribe({
        next: (stream) => {

          if (!!stream) {
      
            this.localVideo.nativeElement.srcObject = stream;

          }


          this.cdr.detectChanges();


        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          console.log('completed');
        }
      });

    this.callService.remoteStream$
      .subscribe({
        next: stream => {
          
          if (!!stream) {

            this.remoteVideo.nativeElement.srcObject = stream;
          }

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
            console.log("remote completed")
        }
      });

    this.callService.remotePeerData$.subscribe({
      next: (data) => {

        if (data.meta == "audio") {
          this.isRemoteMicOpen = ("true" === data.data) ? true : false;

        }

        if (data.meta == "video") {
          this.isRemoteCamOpen = ("true" === data.data) ? true : false;
        }

        if(data.meta=="reconnect"){

          this.callService.call();
        }

        this.cdr.detectChanges();

      }
    })

  }

  ngOnDestroy(): void {

    this.callService.destroyPeer();

  }

  showModal(join: boolean) {

    of(join ? this.callService.establishMediaCall(this.targetID) : this.callService.enableCallAnswer()).subscribe(_ => { });

  }

  endCall() {

    this.callService.closeMediaCall();

  }

  toggleCamera() {

    this.isLocalCamOpen = !this.isLocalCamOpen;

    this.callService.toggleCamera(this.isLocalCamOpen);

    this.cdr.detectChanges();

  }

  toggleMicrophone() {

    this.isMicOpen = !this.isMicOpen;

    this.callService.toggleMicrophone(this.isMicOpen);

    this.cdr.detectChanges();
  }


}
