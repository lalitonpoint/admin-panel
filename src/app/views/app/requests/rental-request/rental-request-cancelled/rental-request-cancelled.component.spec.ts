import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalRequestCancelledComponent } from './rental-request-cancelled.component';

describe('RentalRequestCancelledComponent', () => {
  let component: RentalRequestCancelledComponent;
  let fixture: ComponentFixture<RentalRequestCancelledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentalRequestCancelledComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalRequestCancelledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
