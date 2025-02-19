import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrderBarChart1Component } from './order-bar-chart1.component';

describe('OrderBarChart1Component', () => {
  let component: OrderBarChart1Component;
  let fixture: ComponentFixture<OrderBarChart1Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderBarChart1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderBarChart1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
