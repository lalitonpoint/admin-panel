import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RentalPackageSettingModalComponent } from './rental-package-setting-modal.component';

describe('RentalPackageSettingModalComponent', () => {
  let component: RentalPackageSettingModalComponent;
  let fixture: ComponentFixture<RentalPackageSettingModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RentalPackageSettingModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalPackageSettingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
