import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentCarSpecificationComponent } from './rent-car-specification.component';

describe('RentCarSpecificationComponent', () => {
  let component: RentCarSpecificationComponent;
  let fixture: ComponentFixture<RentCarSpecificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentCarSpecificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentCarSpecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
