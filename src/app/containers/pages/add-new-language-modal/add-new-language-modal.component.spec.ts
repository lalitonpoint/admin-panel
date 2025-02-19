import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddNewLanguageModalComponent } from './add-new-language-modal.component';

describe('AddNewLanguageModalComponent', () => {
  let component: AddNewLanguageModalComponent;
  let fixture: ComponentFixture<AddNewLanguageModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewLanguageModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewLanguageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
