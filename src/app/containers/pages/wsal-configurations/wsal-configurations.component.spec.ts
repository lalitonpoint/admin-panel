import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WsalConfigurationsComponent } from './wsal-configurations.component';

describe('WsalConfigurationsComponent', () => {
  let component: WsalConfigurationsComponent;
  let fixture: ComponentFixture<WsalConfigurationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WsalConfigurationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WsalConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
