import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalRequestEarningComponent } from './rental-request-earning.component';

describe('RentalRequestEarningComponent', () => {
  let component: RentalRequestEarningComponent;
  let fixture: ComponentFixture<RentalRequestEarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentalRequestEarningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalRequestEarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
