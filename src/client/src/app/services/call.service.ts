import { Injectable } from '@angular/core';
import Peer, { DataConnection } from 'peerjs';
import { BehaviorSubject, filter, Observable, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
	providedIn: 'root'
})
export class CallService {

	constructor() { }

	private peer: Peer;
	private statsInterval;

	private mediaCall: Peer.MediaConnection;

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
				this.statsInterval = setInterval(async () => await this.connectionStats(call.peerConnection), 1000);

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
					clearInterval(this.statsInterval);
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
		clearInterval(this.statsInterval);
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
}
