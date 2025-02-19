import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddHotelModelComponent } from './add-hotel-model.component';

describe('AddHotelModelComponent', () => {
  let component: AddHotelModelComponent;
  let fixture: ComponentFixture<AddHotelModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHotelModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHotelModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
