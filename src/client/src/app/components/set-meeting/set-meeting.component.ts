import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthUser } from "src/app/models/auth";
import { Customer } from 'src/app/models/customer';
import { Meeting } from 'src/app/models/meeting';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { MeetingService } from 'src/app/services/meeting.service';

@Component({
	selector: 'app-set-meeting',
	templateUrl: './set-meeting.component.html',
	styleUrls: ['./set-meeting.component.scss']
})
export class SetMeetingComponent implements OnInit {
	meetingId: number
	isNewRecord: boolean;
	meeting: Meeting = {
		id: 0,
		createdAt: null,
		createdBy: null,
		createdFor: null,
		createdById: null,
		userConnId: null,
		customerConnId: null,
		slug: null,
		createdForId: null,
		startsAt: null,
		statId: null,
		stat: null
	};
	user: AuthUser;
	customers: Customer[];
	isAdmin: boolean = false;
	isloading: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private meetingService: MeetingService,
		private customerService: CustomerService,
		private toastService: ToastrService,
		private authService: AuthService,
		private router: Router
	) {}

	ngOnInit(): void {
		let id = +this.route.snapshot.paramMap.get("id");
		this.isNewRecord = !(!!id);

		this.customerService.getAll().subscribe({
			next: (v) => this.customers = v
		});

		this.user = this.authService.getUser();


		if (!this.isNewRecord) {
			this.meetingService.get(id).subscribe({
				next: (v) => this.meeting = v
			});
		}

		this.authService.getUserInfo().subscribe(v => {
			this.isAdmin = v.role == 'admin';
			if (!this.isAdmin) {
				this.meeting.createdById = v.id;
			}
		});
	}

	onSubmit(): void {
		this.isloading = true;
		if (this.isNewRecord) {
			this.meetingService.create(this.meeting).subscribe({
				next: (v) => {
					this.router.navigate(["/"]);
					this.toastService.success(`Görüşme başarıyla oluşturuldu.`);
				},
				error: (err) => this.toastService.error(err?.error?.message),
				complete: () => this.isloading = false
			});
		} else {
			this.meetingService.update(this.meeting).subscribe({
				next: (v) => {
					this.router.navigate(["/"]);
					this.toastService.success(`Görüşme başarıyla güncellendi.`);
				},
				error: (err) => this.toastService.error(err?.error?.message),
				complete: () => this.isloading = false
			});
		}
	}
}
