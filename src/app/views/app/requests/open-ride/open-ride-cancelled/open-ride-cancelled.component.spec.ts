import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenRideCancelledComponent } from './open-ride-cancelled.component';

describe('OpenRideCancelledComponent', () => {
  let component: OpenRideCancelledComponent;
  let fixture: ComponentFixture<OpenRideCancelledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenRideCancelledComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenRideCancelledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
