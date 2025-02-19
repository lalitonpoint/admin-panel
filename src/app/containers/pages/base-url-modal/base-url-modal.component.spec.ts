import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseUrlModalComponent } from './base-url-modal.component';

describe('BaseUrlModalComponent', () => {
  let component: BaseUrlModalComponent;
  let fixture: ComponentFixture<BaseUrlModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseUrlModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseUrlModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
