import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentCarFeatureModelComponent } from './rent-car-feature-model.component';

describe('RentCarFeatureModelComponent', () => {
  let component: RentCarFeatureModelComponent;
  let fixture: ComponentFixture<RentCarFeatureModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentCarFeatureModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentCarFeatureModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
