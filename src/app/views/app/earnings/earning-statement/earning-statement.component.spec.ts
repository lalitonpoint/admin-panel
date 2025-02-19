import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EarningStatementComponent } from './earning-statement.component';

describe('EarningStatementComponent', () => {
  let component: EarningStatementComponent;
  let fixture: ComponentFixture<EarningStatementComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EarningStatementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarningStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
