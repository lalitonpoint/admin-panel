import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PanelNameModalComponent } from './panel-name-modal.component';

describe('PanelNameModalComponent', () => {
  let component: PanelNameModalComponent;
  let fixture: ComponentFixture<PanelNameModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelNameModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelNameModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
