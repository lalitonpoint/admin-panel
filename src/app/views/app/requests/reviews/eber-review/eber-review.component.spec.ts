import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EberReviewComponent } from './eber-review.component';

describe('EberReviewComponent', () => {
  let component: EberReviewComponent;
  let fixture: ComponentFixture<EberReviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EberReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EberReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
