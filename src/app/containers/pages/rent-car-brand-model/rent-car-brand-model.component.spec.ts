import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentCarBrandModelComponent } from './rent-car-brand-model.component';

describe('RentCarBrandModelComponent', () => {
  let component: RentCarBrandModelComponent;
  let fixture: ComponentFixture<RentCarBrandModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentCarBrandModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentCarBrandModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
