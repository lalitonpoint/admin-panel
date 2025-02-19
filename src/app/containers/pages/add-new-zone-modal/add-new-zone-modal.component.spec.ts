import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddNewZoneModalComponent } from './add-new-zone-modal.component';

describe('AddNewZoneModalComponent', () => {
  let component: AddNewZoneModalComponent;
  let fixture: ComponentFixture<AddNewZoneModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewZoneModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewZoneModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
