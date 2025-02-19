import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WsalResponseModalComponent } from './wsal-response-modal.component';

describe('WsalResponseModalComponent', () => {
  let component: WsalResponseModalComponent;
  let fixture: ComponentFixture<WsalResponseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WsalResponseModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WsalResponseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
