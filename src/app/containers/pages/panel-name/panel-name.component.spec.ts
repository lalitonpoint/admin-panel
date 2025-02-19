import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PanelNameComponent } from './panel-name.component';

describe('PanelNameComponent', () => {
  let component: PanelNameComponent;
  let fixture: ComponentFixture<PanelNameComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
