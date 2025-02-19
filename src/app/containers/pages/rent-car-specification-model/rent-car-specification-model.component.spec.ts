import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentCarSpecificationModelComponent } from './rent-car-specification-model.component';

describe('RentCarSpecificationModelComponent', () => {
  let component: RentCarSpecificationModelComponent;
  let fixture: ComponentFixture<RentCarSpecificationModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentCarSpecificationModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentCarSpecificationModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
