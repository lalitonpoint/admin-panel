import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentCarTypeModelComponent } from './rent-car-type-model.component';

describe('RentCarTypeModelComponent', () => {
  let component: RentCarTypeModelComponent;
  let fixture: ComponentFixture<RentCarTypeModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentCarTypeModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentCarTypeModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
