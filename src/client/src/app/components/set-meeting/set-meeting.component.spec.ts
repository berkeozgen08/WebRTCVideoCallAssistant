import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetMeetingComponent } from './set-meeting.component';

describe('SetMeetingComponent', () => {
  let component: SetMeetingComponent;
  let fixture: ComponentFixture<SetMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetMeetingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
