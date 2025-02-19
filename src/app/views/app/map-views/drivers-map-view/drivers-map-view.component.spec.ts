import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DriversMapViewComponent } from './drivers-map-view.component';

describe('DriversMapViewComponent', () => {
  let component: DriversMapViewComponent;
  let fixture: ComponentFixture<DriversMapViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DriversMapViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriversMapViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
