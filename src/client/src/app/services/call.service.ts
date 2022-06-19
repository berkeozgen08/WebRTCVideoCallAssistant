import { Injectable } from '@angular/core';
import hark from "hark";
import Peer, { DataConnection, MediaConnection, PeerJSOption } from 'peerjs';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MeetingService } from "./meeting.service";
declare var ccv: any;
declare var cascade: any;

@Injectable({
	providedIn: 'root'
})
export class CallService {

	constructor(private meetingService: MeetingService) { }

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
	public stats = { local: { video: [], audio: [] }, remote: { video: [], audio: [] }, interval: this.interval, meetingId: 0 };
	public localVideo: HTMLVideoElement;
	public remoteVideo: HTMLVideoElement;
	public localVideoActive = false;
	public localAudioActive = false;
	public remoteVideoActive = false;
	public remoteAudioActive = false;
	public localSpeech: hark.Harker;
	public remoteSpeech: hark.Harker;
	public isUser: boolean;

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
		console.log(remotePeerId);
		try {
			const stream = await this.getUserMedia({ video: true, audio: true });

			this.connectionBs.next(this.peer.connect(remotePeerId));
			this.connectionBs.subscribe({
				next: (conn) => {
					conn.on('error', err => {
						console.error(err);
						//this.snackBar.open(err, 'Close');
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
				this.isCallStartedBs.next(false);
			});
			this.mediaCall.on('close', () => this.onCallClose());
		}
		catch (ex) {
			console.error(ex);
			//this.snackBar.open(ex, 'Close');
			this.isCallStartedBs.next(false);
		}
	}

	public async enableCallAnswer() {
		try {
			const stream = await this.getUserMedia({ video: true, audio: true });
			this.localStreamBs.next(stream);
			this.peer.on("connection", (conn) => {
				this.connectionBs.next(conn);
				this.isConnectionStartedBs.next(true);
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
					this.isCallStartedBs.next(false);
					console.error(err);
				});
				this.mediaCall.on('close', () => {
					this.onCallClose()
					this.stopStatInterval();
				});
			});
		}
		catch (ex) {
			console.error(ex);
			//this.snackBar.open(ex, 'Close');
			this.isCallStartedBs.next(false);
		}
	}

	private onCallClose() {
		this.remoteStreamBs.value!.getTracks().forEach(track => {
			track.stop();
		});
		this.localStreamBs.value!.getTracks().forEach(track => {
			track.stop();
		});
		//this.snackBar.open('Call Ended', 'Close');
		if (this.isUser) {
			this.stopStatInterval();
			this.meetingService.createStat(this.stats).subscribe({
				next: (s) => {
					console.log(s);
				},
				error: console.error
			});
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

	public stopStatInterval() {
		clearInterval(this.statsInterval);
		this.localSpeech.stop();
		this.remoteSpeech.stop();
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
}
