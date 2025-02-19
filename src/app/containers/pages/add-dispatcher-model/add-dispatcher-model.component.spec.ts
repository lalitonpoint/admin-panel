import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddDispatcherModelComponent } from './add-dispatcher-model.component';

describe('AddDispatcherModelComponent', () => {
  let component: AddDispatcherModelComponent;
  let fixture: ComponentFixture<AddDispatcherModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDispatcherModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDispatcherModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
