import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WeeklyEarningComponent } from './weekly-earning.component';

describe('WeeklyEarningComponent', () => {
  let component: WeeklyEarningComponent;
  let fixture: ComponentFixture<WeeklyEarningComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WeeklyEarningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyEarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
