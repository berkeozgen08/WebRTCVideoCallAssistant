import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Meeting } from 'src/app/models/meeting';
import { User } from "src/app/models/user";
import { AuthService } from 'src/app/services/auth.service';
import { MeetingService } from 'src/app/services/meeting.service';
import { UserService } from "src/app/services/user.service";
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
	users: User[] = [];
	meetingsOriginal: Meeting[] = [];
	isloading: boolean = false;
	isAdmin: boolean = false;
	selectedUser: string;

	constructor(
		private meetingService: MeetingService,
		private toastService: ToastrService,
		private authService: AuthService,
		private userService: UserService
	) {}

	ngOnInit(): void {
		this.isloading = true;
		if (this.authService.getUser().role == 'admin') {
			this.isAdmin = true;
			this.meetingService.getAll().subscribe({
				next: (v) => {
					this.meetings = v;
					this.meetingsOriginal = v;
					this.isloading = false;
				}
			});
			this.userService.getAll().subscribe({
				next: (v) => {
					this.users = v;
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
			error: (err) => this.toastService.error(err?.error?.message || err?.error?.title + "</br>" + Object.values(err?.error?.errors || {})?.reduce((acc, i) => acc + (i as any).reduce((acc2, j) => acc + j + " ") + "</br>", ""), "", { enableHtml: true })
		});
	}

	filterUser() {
		console.log(this.selectedUser);
		console.log(this.meetingsOriginal);
		if (parseInt(this.selectedUser) === -1)
			this.meetings = this.meetingsOriginal;
		else
			this.meetings = this.meetingsOriginal.filter(m => m.createdById === parseInt(this.selectedUser));
		console.log(this.meetings);
	}
}
