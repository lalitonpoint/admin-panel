import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CorporateModalComponent } from './corporate-modal.component';

describe('CorporateModalComponent', () => {
  let component: CorporateModalComponent;
  let fixture: ComponentFixture<CorporateModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
