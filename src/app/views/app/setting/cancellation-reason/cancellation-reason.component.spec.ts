import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancellationReasonComponent } from './cancellation-reason.component';

describe('CancellationReasonComponent', () => {
  let component: CancellationReasonComponent;
  let fixture: ComponentFixture<CancellationReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancellationReasonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancellationReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
