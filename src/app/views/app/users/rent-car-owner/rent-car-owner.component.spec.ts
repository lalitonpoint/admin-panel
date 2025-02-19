import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentCarOwnerComponent } from './rent-car-owner.component';

describe('RentCarOwnerComponent', () => {
  let component: RentCarOwnerComponent;
  let fixture: ComponentFixture<RentCarOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentCarOwnerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentCarOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
