import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserPanelImagesComponent } from './user-panel-images.component';

describe('UserPanelImagesComponent', () => {
  let component: UserPanelImagesComponent;
  let fixture: ComponentFixture<UserPanelImagesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPanelImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPanelImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
