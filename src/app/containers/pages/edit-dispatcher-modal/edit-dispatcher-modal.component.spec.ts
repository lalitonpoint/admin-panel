import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditDispatcherModalComponent } from './edit-dispatcher-modal.component';

describe('EditDispatcherModalComponent', () => {
  let component: EditDispatcherModalComponent;
  let fixture: ComponentFixture<EditDispatcherModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDispatcherModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDispatcherModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
