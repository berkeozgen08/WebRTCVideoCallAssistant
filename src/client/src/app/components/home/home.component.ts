import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Meeting } from 'src/app/models/meeting';
import { AuthService } from 'src/app/services/auth.service';
import { MeetingService } from 'src/app/services/meeting.service';
import { v4 as uuidv4 } from "uuid";

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	itemsCountOptions = [10, 20, 50, 100];
	itemsPerPage: number = this.itemsCountOptions[1];
	currentPage = 1;
	meetings: Meeting[] = [];
	isloading: boolean = false;

	constructor(
		private meetingService: MeetingService,
		private toastService: ToastrService,
		private authService: AuthService
	) {}

	ngOnInit(): void {
		this.isloading = true;
		if (this.authService.getUser().role == 'admin') {
			this.meetingService.getAll().subscribe({
				next: (v) => {
					this.meetings = v;
					this.isloading = false;
				}
			});
		} else {
			this.meetingService.getAllByUser().subscribe({
				next: (v) => {
					this.meetings = v;
					this.isloading = false;
				}
			});
		}
	}

	get id(): string {
		return uuidv4();
	}

	getInviteLink(data: string) {
		navigator.clipboard.writeText(`${window.location.toString()}j/${data}`);
		this.toastService.success(`Davet linki panoya kopyalandı.`)
	}

	deleteMeeting(index: number) {
		let absoluteIndex = this.itemsPerPage * (this.currentPage - 1) + index;
		let meeting = this.meetings[absoluteIndex];

		this.meetingService.delete(meeting.id).subscribe({
			next: (v) => {
				this.meetings.splice(absoluteIndex, 1);
				this.toastService.success("Toplantı başarıyla silindi.");
			},
			error: (err) => this.toastService.error(err?.error?.message)
		});
	}
}
