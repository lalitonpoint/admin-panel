import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBannerModalComponent } from './add-banner-modal.component';

describe('AddBannerModalComponent', () => {
  let component: AddBannerModalComponent;
  let fixture: ComponentFixture<AddBannerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBannerModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBannerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
