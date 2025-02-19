import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalPaymentConfigurationComponent } from './rental-payment-configuration.component';

describe('RentalPaymentConfigurationComponent', () => {
  let component: RentalPaymentConfigurationComponent;
  let fixture: ComponentFixture<RentalPaymentConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentalPaymentConfigurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalPaymentConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
