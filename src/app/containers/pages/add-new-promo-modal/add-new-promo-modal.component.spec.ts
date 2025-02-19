import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddNewPromoModalComponent } from './add-new-promo-modal.component';

describe('AddNewPromoModalComponent', () => {
  let component: AddNewPromoModalComponent;
  let fixture: ComponentFixture<AddNewPromoModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewPromoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewPromoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
