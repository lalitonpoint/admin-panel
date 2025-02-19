import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PromoCodeModalComponent } from './promo-code-modal.component';

describe('PromoCodeModalComponent', () => {
  let component: PromoCodeModalComponent;
  let fixture: ComponentFixture<PromoCodeModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoCodeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoCodeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
