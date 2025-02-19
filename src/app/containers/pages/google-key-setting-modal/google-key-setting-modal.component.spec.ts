import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GoogleKeySettingModalComponent } from './google-key-setting-modal.component';

describe('GoogleKeySettingModalComponent', () => {
  let component: GoogleKeySettingModalComponent;
  let fixture: ComponentFixture<GoogleKeySettingModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleKeySettingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleKeySettingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
