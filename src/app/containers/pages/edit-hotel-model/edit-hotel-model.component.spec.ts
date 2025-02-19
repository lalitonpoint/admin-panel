import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditHotelModelComponent } from './edit-hotel-model.component';

describe('EditHotelModelComponent', () => {
  let component: EditHotelModelComponent;
  let fixture: ComponentFixture<EditHotelModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditHotelModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHotelModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
