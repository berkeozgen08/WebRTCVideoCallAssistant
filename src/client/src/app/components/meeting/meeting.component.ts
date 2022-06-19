import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, Observable, of } from 'rxjs';
import { Customer } from "src/app/models/customer";
import { Meeting } from "src/app/models/meeting";
import { User } from "src/app/models/user";
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

	isLocalMicOpen = true;
	isLocalCamOpen = true;
	isRemoteMicOpen = true;
	isRemoteCamOpen = true;
	meeting: Meeting;
	local: User | Customer;
	remote: User | Customer;
	isloading: boolean = false;

	/**
	 *
	 */
	constructor(public callService: CallService, private route: ActivatedRoute, private meetingService: MeetingService, private changeDetector: ChangeDetectorRef) {
	}

	ngOnInit(): void {
		this.isloading = true;
		const slug = this.route.snapshot.paramMap.get("slug");
		this.isCallStarted$ = this.callService.isCallStarted$;
		this.route.queryParams.subscribe({
			next: (params) => {
				// TODO:
				// this.isUser = jwt.role == "user";
				this.isUser = params["a"] == "u";

				this.meetingService.resolveSlug(slug).subscribe({
					next: (meeting) => {
						this.meeting = meeting;
						this.callService.stats.meetingId = meeting.id;
						this.callService.isUser = this.isUser;
						this.local = this.isUser ? meeting.createdBy : meeting.createdFor;
						this.remote = this.isUser ? meeting.createdFor : meeting.createdBy;
						const { userConnId, customerConnId } = meeting;
						if (this.isUser) {
							this.peerID = this.callService.initPeer(userConnId);
							of(this.callService.enableCallAnswer()).subscribe();
						} else {
							this.peerID = this.callService.initPeer(customerConnId);
							of(this.callService.establishMediaCall(userConnId)).subscribe();
						}
						this.callService.isConnectionStarted$.subscribe(() => {
							this.callService.connection$.subscribe(conn => {
								conn.on("data", ({ event, status }) => {
									if (event === "video") {
										this.isRemoteCamOpen = status;
									} else if (event === "audio") {
										this.isRemoteMicOpen = status;
									}
									console.log(event, status);
									this.changeDetector.detectChanges();
									if (event === "video" && status === true) {
										this.callService.remoteStream$.subscribe(stream => {
											this.remoteVideo.nativeElement.srcObject = stream;
										});
									}
								});
							});
						});
						this.isloading = false;
					},
					error: console.error
				});
			}
		});
	}

	ngAfterViewInit(): void {
		this.callService.localVideo = this.localVideo.nativeElement;
		this.callService.remoteVideo = this.remoteVideo.nativeElement;

		this.callService.localStream$.subscribe(stream => {
			if (!!stream) {
				this.localVideo.nativeElement.srcObject = stream
			}
		});

		this.callService.remoteStream$.subscribe(stream => {
			if (!!stream) {
				this.remoteVideo.nativeElement.srcObject = stream;
			}
		});

		this.remoteVideo.nativeElement.addEventListener("play", () => {
			this.callService.startStatInterval(this.callService.mediaCall.peerConnection);
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

	toggleVideo() {
		this.isLocalCamOpen = !this.isLocalCamOpen;
		this.callService.localStream$.subscribe((stream) => {
			stream.getVideoTracks()[0].enabled = this.isLocalCamOpen;
			if (this.isLocalCamOpen) {
				this.changeDetector.detectChanges();
				this.localVideo.nativeElement.srcObject = stream;
			}
			this.callService.connection$.subscribe(conn => conn.send({ event: "video", status: this.isLocalCamOpen }));
		});
	}

	toggleMicrophone() {
		this.isLocalMicOpen = !this.isLocalMicOpen;
		this.callService.localStream$.subscribe((stream) => stream.getAudioTracks()[0].enabled = this.isLocalMicOpen);
		this.callService.connection$.subscribe(conn => conn.send({ event: "audio", status: this.isLocalMicOpen }));
	}
}
