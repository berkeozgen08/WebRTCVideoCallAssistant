import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, Observable, of } from 'rxjs';
import { CallService } from 'src/app/services/call.service';

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
  constructor(private callService: CallService,private route:ActivatedRoute) {
  }

  ngOnInit(): void {
    this.isCallStarted$ = this.callService.isCallStarted$;
    this.route.queryParams.subscribe({
      next:(params)=>{
        //check is user or client
        
        const userId=(params['userId']);
        
        const clientId=(params['clientId']);

        this.isUser=!(!!clientId);

        this.peerID = this.callService.initPeer(this.isUser?userId:clientId);
        of(this.isUser?this.callService.enableCallAnswer():this.callService.establishMediaCall(userId)).subscribe();
        
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
    
  }

  toggleMicrophone(){

  }

}
