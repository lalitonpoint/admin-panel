import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VersionBarChartComponent } from './version-bar-chart.component';

describe('VersionBarChartComponent', () => {
  let component: VersionBarChartComponent;
  let fixture: ComponentFixture<VersionBarChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VersionBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VersionBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
