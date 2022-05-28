import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MeetingStatsComponent } from './components/meeting-stats/meeting-stats.component';
import { MeetingComponent } from './components/meeting/meeting.component';
import { SetMeetingComponent } from './components/set-meeting/set-meeting.component';
import { CustomersComponent } from './components/customers/customers.component';
import { CustomerComponent } from './components/customer/customer.component';

const routes: Routes = [{
  path: '',
  component: HomeComponent
}, {
  path: 'meeting',
  component: MeetingComponent
}, {
  path: 'meeting-stats',
  component: MeetingStatsComponent
}, {
  path: 'set-meeting',
  component: SetMeetingComponent
}, {

  path: 'user/joinMeeting',
  component: MeetingComponent
}, {
  path: 'client/jointMeeting',
  component: MeetingComponent
},{
  path:'customers',
  component:CustomersComponent,
},{
  path:'customers/:id',
  component:CustomerComponent
},{
  path:'customers/create',
  component:CustomerComponent
}, {
  path: '**',
  redirectTo: ''
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
