import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
import { UsersComponent } from './components/users/users.component';
import { UserComponent } from './components/user/user.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxLoadingModule } from 'ngx-loading';
import { LoginComponent } from './components/login/login.component';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    SetMeetingComponent,
    MeetingComponent,
    MeetingStatsComponent,
    HomeComponent,
    CustomersComponent,
    CustomerComponent,
    UsersComponent,
    UserComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ToastNoAnimationModule.forRoot(),
    NgxPaginationModule,
    NgxLoadingModule.forRoot({}),
    BrowserAnimationsModule,
    JwtModule.forRoot({
      config:{
        tokenGetter: ()=>{
            return localStorage.getItem(environment.ACCESS_TOKEN);
        }
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
