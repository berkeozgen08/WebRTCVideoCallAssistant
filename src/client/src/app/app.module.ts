import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SetMeetingComponent } from './components/set-meeting/set-meeting.component';
import { MeetingComponent } from './components/meeting/meeting.component';
import { MeetingStatsComponent } from './components/meeting-stats/meeting-stats.component';

@NgModule({
  declarations: [
    AppComponent,
    SetMeetingComponent,
    MeetingComponent,
    MeetingStatsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
