import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FirebaseKeyModalComponent } from './firebase-key-modal.component';

describe('FirebaseKeyModalComponent', () => {
  let component: FirebaseKeyModalComponent;
  let fixture: ComponentFixture<FirebaseKeyModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FirebaseKeyModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirebaseKeyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
