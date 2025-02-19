import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditHubModelComponent } from './edit-hub-model.component';

describe('EditHubModelComponent', () => {
  let component: EditHubModelComponent;
  let fixture: ComponentFixture<EditHubModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditHubModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHubModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
