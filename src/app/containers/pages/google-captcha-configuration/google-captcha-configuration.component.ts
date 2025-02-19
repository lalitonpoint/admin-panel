import { Component, ViewChild,Input, EventEmitter, Output } from '@angular/core';
import { GoogleCaptchaConfigurationModalComponent } from '../google-captcha-configuration-modal/google-captcha-configuration-modal.component';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-google-captcha-configuration',
  templateUrl: './google-captcha-configuration.component.html',
  styleUrls: ['./google-captcha-configuration.component.scss']
})
export class GoogleCaptchaConfigurationComponent {

  @Input() setting_detail:any;
  @Output() google_captcha_change_event = new EventEmitter<any>();
  @ViewChild('GoogleCaptchaConfigurationModal', { static: true }) GoogleCaptchaConfigurationModal: GoogleCaptchaConfigurationModalComponent;

  constructor(public _helper:Helper) { }

  //open modal
  showGoogleCaptchaConfigurationModal() {
    this.GoogleCaptchaConfigurationModal.show(this.setting_detail);
  }

  //emit data
  getSettingData(){
    this.google_captcha_change_event.emit();
  }

}
