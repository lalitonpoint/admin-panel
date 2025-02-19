import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MassNotificationComponent } from './mass-notification.component';

describe('MassNotificationComponent', () => {
  let component: MassNotificationComponent;
  let fixture: ComponentFixture<MassNotificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MassNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MassNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
