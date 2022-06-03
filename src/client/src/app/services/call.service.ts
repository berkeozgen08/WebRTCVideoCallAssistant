import { ConstantPool } from '@angular/compiler';
import { Injectable } from '@angular/core';
import Peer from 'peerjs';
import { BehaviorSubject, filter, Observable, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { PeerData } from '../models/data';
@Injectable({
  providedIn: 'root'
})
export class CallService {

  constructor() { }

  private peer: Peer;
  private statsInterval;

  private mediaCall: Peer.MediaConnection;
  private dataConnection: Peer.DataConnection;

  private localStreamBs = new BehaviorSubject<MediaStream>(null);
  public localStream$: Observable<MediaStream> = this.localStreamBs.asObservable();

  private remoteStreamBs = new BehaviorSubject<MediaStream>(null);
  public remoteStream$: Observable<MediaStream> = this.remoteStreamBs.asObservable();

  private isCallStartedBs = new Subject<boolean>();
  public isCallStarted$ = this.isCallStartedBs.asObservable();
  private remotePeerData = new Subject<PeerData>();
  public remotePeerData$ = this.remotePeerData.asObservable();

  private isCamOpen = true;
  private isMicOpen = true;
  private stream: MediaStream;
  private remotePeerId: string

  initPeer(id: string): string {
    if (!this.peer || !this.peer.disconnected) {

      const peerJsOptions: Peer.PeerJSOption = {
        debug: 3,
        config: {
          iceServers: [{
            urls: [
              'stun:stun1.l.google.com:19302',
              'stun:stun2.l.google.com:19302',
            ]
          }]
        }
      };

      try {
        //let id = uuidv4();
        this.peer = new Peer(id, peerJsOptions);
        return id;
      } catch (error) {
        console.error(error);
      }
    }

    return "";
  }

  public async establishMediaCall(remotePeerId: string) {
    this.remotePeerId = remotePeerId;
    try {
      this.establishMedia().then(() => {

        this.dataConnection = this.peer.connect(this.remotePeerId);
        this.dataConnection.on('error', err => {
          console.error(err);
          //this.snackBar.open(err, 'Close');
        });
        this.dataConnection.on('data', (data) => {

          let receivedData = (data) as PeerData;
          this.remotePeerData.next(receivedData);
        })

        this.mediaCall = this.peer.call(this.remotePeerId, this.stream);//

        if (!this.mediaCall) {
          let errorMessage = 'Unable to connect to remote peer';
          //this.snackBar.open(errorMessage, 'Close');
          throw new Error(errorMessage);
        }

        //this.localStreamBs.next(this.stream);
        this.isCallStartedBs.next(true);

        this.mediaCall.on('stream', (remoteStream) => {
          
          //receive remote stream

          console.log(`received stream id:${remoteStream.id} open:${remoteStream.active}`);

          //this.stream=remoteStream;
          
          this.remoteStreamBs.next(remoteStream);
          
        });

        this.mediaCall.on('error', err => {
          //this.snackBar.open(err, 'Close');
          console.error(err);
          this.isCallStartedBs.next(false);
        });


        this.mediaCall.on('close', () => {
          console.log("Close remote connection");
        });

      });


    }
    catch (ex) {
      console.error(ex);
      //this.snackBar.open(ex, 'Close');
      this.isCallStartedBs.next(false);
    }
  }

  public async enableCallAnswer() {
    try {

      this.establishMedia().then(() => {

        this.peer.on('call', async (call) => {

          this.mediaCall = call;

          this.isCallStartedBs.next(true);
          
          
          //
          
          this.mediaCall.answer(this.stream);
          
          this.mediaCall.on('stream', (remoteStream) => {

            console.log(remoteStream.id);

            this.remoteStreamBs.next(remoteStream);

          });

          this.mediaCall.on('error', err => {
            //this.snackBar.open(err, 'Close');
            this.isCallStartedBs.next(false);

            console.error(err);
          });

          this.mediaCall.on('close', () => {

          });



        });

        //receive data
        this.peer.on('connection', (connnection) => {
          this.dataConnection = connnection;

          connnection.on('data', (data) => {

            let receivedData = (data) as PeerData;
            this.remotePeerData.next(receivedData);

          })
        })

      });

    }
    catch (ex) {
      console.error(ex);
      //this.snackBar.open(ex, 'Close');
      this.isCallStartedBs.next(false);
    }
  }

  public sendText(data: PeerData) {
    this.dataConnection.send(data);
  }

  private onCallClose() {

  }

  public async connectionStats(conn: RTCPeerConnection) {
	const stats = await conn.getStats(null);
	stats.forEach(report => {
		if (report.type === "inbound-rtp" && (report.kind === "video" || report.kind === "audio")) {
			console.log(report);
		}
	});
  }

  public closeMediaCall() {
    this.mediaCall?.close();
    if (!this.mediaCall) {
      this.onCallClose()
    }
    this.isCallStartedBs.next(false);
  }

  public destroyPeer() {
    this.mediaCall?.close();
    this.peer?.disconnect();
    this.peer?.destroy();
  }

  public async toggleMicrophone(isOpen: boolean) {

    this.isMicOpen = isOpen;
    //await this.establishMedia();
    this.stream.getAudioTracks().forEach(v => {
      v.enabled = isOpen;
    });

    this.sendText({
      meta: 'audio',
      data: `${isOpen}`
    });

    //this.localStreamBs.next(this.stream);

  }

  public call(){
    this.mediaCall = this.peer.call(this.remotePeerId, this.stream);
  }

  public async toggleCamera(isOpen: boolean) {
    this.isCamOpen = isOpen;

    await this.establishMedia().then((v) => {
      this.sendText({
        meta: 'video',
        data: `${isOpen}`
      });
    }).then(v => {

      //if open close and connect same user again it works perfect
      if (!!this.remotePeerId) { // this works fine
        this.mediaCall = this.peer.call(this.remotePeerId, this.stream);//
      } else if (isOpen) {
        this.mediaCall.close();
        this.enableCallAnswer();
        this.sendText({
          meta: 'reconnect',
          data: `${isOpen}`
        });
      }
    })


  }

  public async establishMedia() {

    if (!!this.stream && this.stream.getTracks()[0].enabled) {
      this.stream.getTracks().forEach(v => v.stop());
    }

    this.stream = await navigator.mediaDevices.getUserMedia({ video: this.isCamOpen, audio: this.isMicOpen });
    this.localStreamBs.next(this.stream);

  }

}
