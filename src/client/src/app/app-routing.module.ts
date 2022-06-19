import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MeetingStatsComponent } from './components/meeting-stats/meeting-stats.component';
import { MeetingComponent } from './components/meeting/meeting.component';
import { SetMeetingComponent } from './components/set-meeting/set-meeting.component';
import { CustomersComponent } from './components/customers/customers.component';
import { CustomerComponent } from './components/customer/customer.component';
import { UsersComponent } from './components/users/users.component';
import { UserComponent } from './components/user/user.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/auth.guard';
import { AdminGuard } from './services/admin.guard';
import { AdminComponent } from './components/admin/admin.component';
import { AdminsComponent } from './components/admins/admins.component';

const routes: Routes = [{
  path: '',
  component: HomeComponent,
  canActivate:[AuthGuard]
}, {
  path: 'meeting',
  component: MeetingComponent,
  canActivate:[AuthGuard]
}, {
  path: 'meeting-stats/:id',
  component: MeetingStatsComponent,
  canActivate:[AuthGuard]
}, {
  path: 'meetings/create',
  component: SetMeetingComponent,
  canActivate:[AuthGuard]
}, {
  path: 'meetings/:id',
  component: SetMeetingComponent,
  canActivate:[AuthGuard]
}, {
  path: 'j/:slug',
  component: MeetingComponent
}, {
  path: 'client/joinMeeting',
  component: MeetingComponent
}, {
  path: 'customers',
  component: CustomersComponent,
  canActivate:[AuthGuard,AdminGuard]
}, {
  path: 'customers/:id',
  component: CustomerComponent,
  canActivate:[AuthGuard,AdminGuard]
}, {
  path: 'customers/create',
  component: CustomerComponent,
  canActivate:[AuthGuard,AdminGuard]
}, {
  path: 'users',
  component: UsersComponent,
  canActivate:[AuthGuard,AdminGuard]
}, {
  path: 'users/:id',
  component: UserComponent,
  canActivate:[AuthGuard,AdminGuard]
}, {
  path: 'users/create',
  component: UserComponent,
  canActivate:[AuthGuard,AdminGuard]
},{
  path: 'login',
  component: LoginComponent
},{
  path: 'admin-login',
  component: LoginComponent
},{
  path: 'admins',
  component: AdminsComponent,
  canActivate:[AuthGuard]
},{
  path: 'admins/:id',
  component: AdminComponent,
  canActivate:[AuthGuard]
},{
  path: 'admins/create',
  component: AdminComponent,
  canActivate:[AuthGuard]
},{
  path: '**',
  redirectTo: ''
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
