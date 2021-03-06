import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MeetingComponent } from './components/meeting/meeting.component';
import { AuthService } from './services/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'WebRTCVideoCallAssistant.Client';
	isHide: boolean = false;
	isLoggedIn: boolean = false;
	isAdmin: boolean = false;
	
	constructor(private authService: AuthService, private router: Router) {}

	ngOnInit(): void {
		this.authService.isLoggedIn().subscribe(v => {
			this.isLoggedIn = v;
			if (v)
				this.authService.getUserInfo().subscribe(info => {
					this.isAdmin = info.role == 'admin';
				});
		});
	}

	logout() {
		this.authService.logout();
		this.router.navigate(['/login']);
	}

	bindMeeting(componentRef) {
		this.isHide = (componentRef instanceof MeetingComponent)
	}
}
