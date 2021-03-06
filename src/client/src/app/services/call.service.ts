import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import hark from 'hark';
import Peer, { DataConnection, MediaConnection, PeerJSOption } from 'peerjs';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MeetingService } from "./meeting.service";
declare var ccv: any;
declare var cascade: any;

@Injectable({
	providedIn: 'root'
})
export class CallService {

	constructor(private meetingService: MeetingService, private router: Router, private ngZone: NgZone) { }

	private peer: Peer;

	public mediaCall: MediaConnection;

	private localStreamBs = new BehaviorSubject<MediaStream>(null);
	public localStream$: Observable<MediaStream> = this.localStreamBs.asObservable();
	private remoteStreamBs = new BehaviorSubject<MediaStream>(null);
	public remoteStream$: Observable<MediaStream> = this.remoteStreamBs.asObservable();

	private isCallStartedBs = new Subject<boolean>();
	public isCallStarted$ = this.isCallStartedBs.asObservable();

	public localId: string;
	public remoteId: string;

	public connectionBs = new BehaviorSubject<DataConnection>(null);
	public connection$ = this.connectionBs.asObservable();
	public isConnectionStartedBs = new Subject<boolean>();
	public isConnectionStarted$ = this.isConnectionStartedBs.asObservable();

	public getUserMedia: ({ video, audio }: { video?: boolean, audio?: boolean }) => Promise<MediaStream> =
		navigator.mediaDevices.getUserMedia ||
		(navigator as any).mediaDevices.webkitGetUserMedia ||
		(navigator as any).mediaDevices.mozGetUserMedia ||
		(navigator as any).getUserMedia ||
		(navigator as any).webkitGetUserMedia ||
		(navigator as any).mozGetUserMedia

	private statsInterval;
	private interval = 5000;
	public stats = { local: { video: [], audio: [] }, remote: { video: [], audio: [] }, interval: this.interval, meetingId: 0, startedAt: null };
	public localVideo: HTMLVideoElement;
	public remoteVideo: HTMLVideoElement;
	public localVideoActive = false;
	public localAudioActive = false;
	public remoteVideoActive = false;
	public remoteAudioActive = false;
	public localSpeech: hark.Harker;
	public remoteSpeech: hark.Harker;
	public isUser: boolean;
	public disconnected = false;
	public exited = false;
	public reconnectInterval;

	initPeer(id: string): string {
		if (!this.peer || !this.peer.disconnected) {
			const peerJsOptions: PeerJSOption = {
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
				this.localId = id;
				this.peer = new Peer(id, peerJsOptions);
				return id;
			} catch (error) {
				console.error(error);
			}
		}

		return "";
	}

	public async establishMediaCall(remotePeerId: string) {
		this.remoteId = remotePeerId;
		this.isUser = false;
		try {
			const stream = await this.getUserMedia({ video: true, audio: true });

			this.connectionBs.next(this.peer.connect(remotePeerId));
			this.connectionBs.subscribe({
				next: (conn) => {
					conn.on('error', err => {
						this.ngZone.run(() => this.closeMediaCall());
						console.log(0);
					});
					conn.on('close', () => {
						this.ngZone.run(() => this.closeMediaCall());
						console.log(1);
					});
					this.isConnectionStartedBs.next(true);
				}
			});

			this.mediaCall = this.peer.call(remotePeerId, stream);
			if (!this.mediaCall) {
				let errorMessage = 'Unable to connect to remote peer';
				//this.snackBar.open(errorMessage, 'Close');
				throw new Error(errorMessage);
			}
			this.localStreamBs.next(stream);
			this.isCallStartedBs.next(true);

			this.mediaCall.on('stream', (remoteStream) => {
				this.remoteStreamBs.next(remoteStream);
			});
			this.mediaCall.on('error', (err) => {
				//this.snackBar.open(err, 'Close');
				console.error(err);
				this.ngZone.run(() => this.closeMediaCall(true));
				console.log(2);
			});
			this.mediaCall.on('close', () => {
				this.ngZone.run(() => this.closeMediaCall(true));
				console.log(3);
			});
			this.peer.on("close", () => {
				this.ngZone.run(() => this.closeMediaCall(true));
				console.log(4);
			});
			this.peer.on("disconnected", () => {
				this.ngZone.run(() => this.closeMediaCall(true));
				console.log(5);
			});
			this.peer.on("error", () => {
				this.ngZone.run(() => this.closeMediaCall(true));
				console.log(6);
			});
		}
		catch (ex) {
			console.error(ex);
			//this.snackBar.open(ex, 'Close');
			this.isCallStartedBs.next(false);
		}
	}

	public async enableCallAnswer() {
		this.isUser = true;
		try {
			const stream = await this.getUserMedia({ video: true, audio: true });
			this.localStreamBs.next(stream);
			this.peer.on("connection", (conn) => {
				this.connectionBs.next(conn);
				this.isConnectionStartedBs.next(true);
				conn.on('error', err => {
					this.ngZone.run(() => this.closeMediaCall());
					console.log(7);
				});
				conn.on('close', () => {
					this.ngZone.run(() => this.closeMediaCall());
					console.log(8);
				});
			});
			this.peer.on('call', async (call) => {
				this.mediaCall = call;
				this.isCallStartedBs.next(true);
				// this.statsInterval = setInterval(/* async */() => /* await */ this.connectionStats(call.peerConnection), this.interval);

				this.mediaCall.answer(stream);
				this.remoteId = this.mediaCall.peer;
				this.mediaCall.on('stream', (remoteStream) => {
					this.remoteStreamBs.next(remoteStream);
				});
				this.mediaCall.on('error', err => {
					//this.snackBar.open(err, 'Close');
					this.ngZone.run(() => this.closeMediaCall());
					console.log(9);
					this.isCallStartedBs.next(false);
					console.error(err);
				});
				this.mediaCall.on('close', () => {
					this.ngZone.run(() => this.closeMediaCall());
					console.log(10);
				});
			});
			this.peer.on("close", () => {
				this.ngZone.run(() => this.closeMediaCall());
				console.log(11);
			});
			this.peer.on("disconnected", () => {
				this.ngZone.run(() => this.closeMediaCall());
				console.log(12);
			});
			this.peer.on("error", () => {
				this.ngZone.run(() => this.closeMediaCall());
				console.log(13);
			});
		}
		catch (ex) {
			console.error(ex);
			//this.snackBar.open(ex, 'Close');
			this.isCallStartedBs.next(false);
		}
	}

	public /* async */ connectionStats(conn: RTCPeerConnection) {
		// const stats = await conn.getStats(null);
		// stats.forEach(report => {
		// 	if (report.type === "inbound-rtp" && (report.kind === "video" || report.kind === "audio")) {
		// 		console.log(report);
		// 	}
		// });
		const canvas = document.createElement("canvas");
		const localWidth = this.localVideo.videoWidth, localHeight = this.localVideo.videoHeight;
		const remoteWidth = this.remoteVideo.videoWidth, remoteHeight = this.remoteVideo.videoHeight;
		canvas.width = localWidth + remoteWidth;
		canvas.height = localHeight > remoteWidth ? localHeight : remoteHeight;
		const context = canvas.getContext("2d");
		if (!this.localVideo.hidden) context.drawImage(this.localVideo, 0, 0, localWidth, localHeight);
		if (!this.remoteVideo.hidden) context.drawImage(this.remoteVideo, localWidth, 0, remoteWidth, remoteHeight);

		const comp = ccv.detect_objects({
			"canvas": canvas,
			"cascade": cascade,
			"interval": 5,
			"min_neighbors": 1
		});

		this.localVideoActive = false;
		this.remoteVideoActive = false;
		for (const i of comp) {
			const xavg = i.x + i.width / 2, yavg = i.y + i.height / 2;
			// console.log(localWidth, localHeight);
			// console.log(remoteWidth, remoteHeight);
			// console.log(xavg, yavg);
			// console.log(xavg > 0, xavg < localWidth, yavg > 0, yavg < localHeight);
			// console.log(xavg > localWidth, xavg < remoteWidth + localWidth, yavg > 0, yavg < remoteHeight);
			if (xavg > 0 && xavg < localWidth && yavg > 0 && yavg < localHeight) {
				this.localVideoActive = true;
			} else if (xavg > localWidth && xavg < remoteWidth + localWidth && yavg > 0 && yavg < remoteHeight) {
				this.remoteVideoActive = true;
			}
		}

		this.stats.local.video.push({
			date: new Date().toISOString(),
			visible: this.localVideoActive
		});

		this.stats.remote.video.push({
			date: new Date().toISOString(),
			visible: this.remoteVideoActive
		});

		if (this.stats.local.video.length >= 2
			&& (this.stats.local.video[this.stats.local.video.length - 1].visible
				|| this.stats.local.video[this.stats.local.video.length - 2].visible)) {
			this.localVideoActive = true;
		}

		if (this.stats.remote.video.length >= 2
			&& (this.stats.remote.video[this.stats.remote.video.length - 1].visible
				|| this.stats.remote.video[this.stats.remote.video.length - 2].visible)) {
			this.remoteVideoActive = true;
		}
	}

	public startStatInterval(peerConnection: RTCPeerConnection) {
		this.statsInterval = setInterval(() => this.connectionStats(peerConnection), this.interval);
		const localStream = this.localStreamBs.value;
		const remoteStream = this.remoteStreamBs.value;
		// console.log(localStream, remoteStream);
		this.localSpeech = hark(localStream);
		this.remoteSpeech = hark(remoteStream);
		this.localSpeech.on("speaking", () => {
			// console.log("local speaking");
			this.localAudioActive = true;
			this.stats.local.audio.push({
				date: new Date().toISOString(),
				speaking: true
			});
		});
		this.remoteSpeech.on("speaking", () => {
			// console.log("remote speaking");
			this.remoteAudioActive = true;
			this.stats.remote.audio.push({
				date: new Date().toISOString(),
				speaking: true
			});
		});
		this.localSpeech.on("stopped_speaking", () => {
			// console.log("local stopped_speaking");
			this.localAudioActive = false;
			this.stats.local.audio.push({
				date: new Date().toISOString(),
				speaking: false
			});
		});
		this.remoteSpeech.on("stopped_speaking", () => {
			// console.log("remote stopped_speaking");
			this.remoteAudioActive = false;
			this.stats.remote.audio.push({
				date: new Date().toISOString(),
				speaking: false
			});
		});
	}

	public sendData(event, status) {
		console.log("sent", { event, status });
		this.connectionBs.value?.send({ event, status });
	}

	public stopStatInterval() {
		clearInterval(this.statsInterval);
		this.localSpeech?.stop();
		this.remoteSpeech?.stop();
	}

	public closeMediaCall(endMeeting = false) {
		if (this.exited) return;
		if (endMeeting) this.exited = true;
		console.log(endMeeting);
		if (!this.isUser || endMeeting) {
			this.peer?.destroy();

			this.remoteStreamBs.value?.getTracks().forEach(track => {
				track.stop();
			});
			this.localStreamBs.value?.getTracks().forEach(track => {
				track.stop();
			});
			if (this.reconnectInterval) {
				clearInterval(this.reconnectInterval);
				this.reconnectInterval = null;
			}
		}

		if (this.isUser) {
			this.stopStatInterval();
			if (endMeeting) {
				if (this.statsInterval)
					this.meetingService.createStat(this.stats).subscribe({
						next: (s) => {
							this.router.navigate(['/']);
						},
						error: console.error
					});
				else
					this.router.navigate(['/']);
			}
			else {
				this.disconnected = true;
				if (!this.reconnectInterval)
					this.reconnectInterval = setInterval(() => this.peer.reconnect(), 2000);
			}
		} else {
			this.router.navigate(['/end']);
		}

		this.isCallStartedBs.next(false);
	}

	public destroyPeer() {
		this.mediaCall?.close();
		this.peer?.disconnect();
		this.peer?.destroy();
	}
}
