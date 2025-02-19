import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddNewSurgeTimeModalComponent } from './add-new-surge-time-modal.component';

describe('AddNewSurgeTimeModalComponent', () => {
  let component: AddNewSurgeTimeModalComponent;
  let fixture: ComponentFixture<AddNewSurgeTimeModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewSurgeTimeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewSurgeTimeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
