import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TripDetailsModalComponent } from './trip-details-modal.component';

describe('TripDetailsModalComponent', () => {
  let component: TripDetailsModalComponent;
  let fixture: ComponentFixture<TripDetailsModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TripDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
