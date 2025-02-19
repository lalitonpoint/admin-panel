import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentCarServiceComponent } from './rent-car-service.component';

describe('RentCarServiceComponent', () => {
  let component: RentCarServiceComponent;
  let fixture: ComponentFixture<RentCarServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentCarServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentCarServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
