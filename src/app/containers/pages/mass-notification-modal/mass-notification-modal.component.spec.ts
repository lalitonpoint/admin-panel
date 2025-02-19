import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MassNotificationModalComponent } from './mass-notification-modal.component';

describe('MassNotificationModalComponent', () => {
  let component: MassNotificationModalComponent;
  let fixture: ComponentFixture<MassNotificationModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MassNotificationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MassNotificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
