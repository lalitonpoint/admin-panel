import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewCancellationReasonComponent } from './add-new-cancellation-reason.component';

describe('AddNewCancellationReasonComponent', () => {
  let component: AddNewCancellationReasonComponent;
  let fixture: ComponentFixture<AddNewCancellationReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewCancellationReasonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewCancellationReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
