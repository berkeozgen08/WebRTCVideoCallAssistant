import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { filter, Observable, of } from 'rxjs';
import { CallService } from './services/call.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, AfterViewInit, OnInit {

  title = 'WebRTCVideoCallAssistant.Client';

  @ViewChild('localVideo') localVideo: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo: ElementRef<HTMLVideoElement>;

  targetID: string = "";
  peerID: string;
  public isCallStarted$: Observable<boolean>;


  /**
   *
   */
  constructor(private callService: CallService) {
  }

  ngOnInit(): void {
    this.isCallStarted$ = this.callService.isCallStarted$;
    this.peerID = this.callService.initPeer();
  }

  ngAfterViewInit(): void {
    this.callService.localStream$
      .pipe(filter(res => !!res))
      .subscribe(stream => {
        this.localVideo.nativeElement.srcObject = stream
      });

    this.callService.remoteStream$
      .pipe(filter(res => !!res))
      .subscribe(stream => {
        this.remoteVideo.nativeElement.srcObject = stream
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

}
