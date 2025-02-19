import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalRequestRunningComponent } from './rental-request-running.component';

describe('RentalRequestRunningComponent', () => {
  let component: RentalRequestRunningComponent;
  let fixture: ComponentFixture<RentalRequestRunningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentalRequestRunningComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalRequestRunningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
