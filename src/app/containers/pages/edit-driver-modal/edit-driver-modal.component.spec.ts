import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditDriverModalComponent } from './edit-driver-modal.component';

describe('EditDriverModalComponent', () => {
  let component: EditDriverModalComponent;
  let fixture: ComponentFixture<EditDriverModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDriverModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDriverModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
