import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OrdersBarChartComponent } from './orders-bar-chart.component';

describe('OrdersBarChartComponent', () => {
  let component: OrdersBarChartComponent;
  let fixture: ComponentFixture<OrdersBarChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
