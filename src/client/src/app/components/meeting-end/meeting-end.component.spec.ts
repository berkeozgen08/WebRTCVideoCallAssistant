import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingEndComponent } from './meeting-end.component';

describe('MeetingEndComponent', () => {
  let component: MeetingEndComponent;
  let fixture: ComponentFixture<MeetingEndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingEndComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
