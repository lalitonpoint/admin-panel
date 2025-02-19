import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapViewsComponent } from './map-views.component';

describe('MapViewsComponent', () => {
  let component: MapViewsComponent;
  let fixture: ComponentFixture<MapViewsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapViewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
