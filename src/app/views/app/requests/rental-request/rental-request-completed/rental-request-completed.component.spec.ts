import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalRequestCompletedComponent } from './rental-request-completed.component';

describe('RentalRequestCompletedComponent', () => {
  let component: RentalRequestCompletedComponent;
  let fixture: ComponentFixture<RentalRequestCompletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentalRequestCompletedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalRequestCompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
