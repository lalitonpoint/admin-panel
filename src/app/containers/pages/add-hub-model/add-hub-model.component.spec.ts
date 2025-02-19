import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddHubModelComponent } from './add-hub-model.component';

describe('AddHubModelComponent', () => {
  let component: AddHubModelComponent;
  let fixture: ComponentFixture<AddHubModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHubModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHubModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
