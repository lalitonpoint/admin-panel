import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddNewPlaceModalComponent } from './add-new-place-modal.component';

describe('AddNewPlaceModalComponent', () => {
  let component: AddNewPlaceModalComponent;
  let fixture: ComponentFixture<AddNewPlaceModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewPlaceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewPlaceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
