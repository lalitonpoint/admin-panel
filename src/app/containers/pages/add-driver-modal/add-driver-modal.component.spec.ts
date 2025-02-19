import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDriverModalComponent } from './add-driver-modal.component';

describe('AddDriverModalComponent', () => {
  let component: AddDriverModalComponent;
  let fixture: ComponentFixture<AddDriverModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDriverModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDriverModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
