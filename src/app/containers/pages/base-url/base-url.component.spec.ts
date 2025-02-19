import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseUrlComponent } from './base-url.component';

describe('BaseUrlComponent', () => {
  let component: BaseUrlComponent;
  let fixture: ComponentFixture<BaseUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BaseUrlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
