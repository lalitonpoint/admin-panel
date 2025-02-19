import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TripFeatureComponent } from './trip-feature.component';

describe('TripFeatureComponent', () => {
  let component: TripFeatureComponent;
  let fixture: ComponentFixture<TripFeatureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TripFeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
