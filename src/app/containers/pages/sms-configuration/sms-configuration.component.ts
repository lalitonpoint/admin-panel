import { Component, Input, ViewChild,Output,EventEmitter } from '@angular/core';
import { SmsConfigurationModalComponent } from '../sms-configuration-modal/sms-configuration-modal.component';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-sms-configuration',
  templateUrl: './sms-configuration.component.html',
  styleUrls: ['./sms-configuration.component.scss']
})
export class SmsConfigurationComponent {

  @Input() setting_detail:any;
  @Output() SMS_data = new EventEmitter<any>();
  @ViewChild('smsConfigurationModal', { static: true }) smsConfigurationModal: SmsConfigurationModalComponent;

  constructor(public _helper:Helper) { }

  //open modal
  showSmsConfigurationModal() {
    this.smsConfigurationModal.show(this.setting_detail);
  }

  //emit data
  getSettingData(){
    this.SMS_data.emit();
  }

}
