import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GuestTokenModalComponent } from './guest-token-modal.component';

describe('GuestTokenModalComponent', () => {
  let component: GuestTokenModalComponent;
  let fixture: ComponentFixture<GuestTokenModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestTokenModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestTokenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
