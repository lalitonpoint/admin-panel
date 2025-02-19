import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScheduledComponent } from './scheduled.component';

describe('ScheduledComponent', () => {
  let component: ScheduledComponent;
  let fixture: ComponentFixture<ScheduledComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
