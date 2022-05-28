import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SetMeetingComponent } from './components/set-meeting/set-meeting.component';
import { MeetingComponent } from './components/meeting/meeting.component';
import { MeetingStatsComponent } from './components/meeting-stats/meeting-stats.component';
import { HomeComponent } from './components/home/home.component';
import { CustomersComponent } from './components/customers/customers.component';
import { CustomerComponent } from './components/customer/customer.component';
import { ToastrModule, ToastNoAnimation, ToastNoAnimationModule } from 'ngx-toastr';



@NgModule({
  declarations: [
    AppComponent,
    SetMeetingComponent,
    MeetingComponent,
    MeetingStatsComponent,
    HomeComponent,
    CustomersComponent,
    CustomerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ToastNoAnimationModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
