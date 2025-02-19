import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReviewDetailsModalComponent } from './review-details-modal.component';

describe('ReviewDetailsModalComponent', () => {
  let component: ReviewDetailsModalComponent;
  let fixture: ComponentFixture<ReviewDetailsModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewDetailsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
