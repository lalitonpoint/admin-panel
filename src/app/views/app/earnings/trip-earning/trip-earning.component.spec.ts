import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TripEarningComponent } from './trip-earning.component';

describe('TripEarningComponent', () => {
  let component: TripEarningComponent;
  let fixture: ComponentFixture<TripEarningComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TripEarningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripEarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
