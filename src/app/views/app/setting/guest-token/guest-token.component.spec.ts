import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GuestTokenComponent } from './guest-token.component';

describe('GuestTokenComponent', () => {
  let component: GuestTokenComponent;
  let fixture: ComponentFixture<GuestTokenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GuestTokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
