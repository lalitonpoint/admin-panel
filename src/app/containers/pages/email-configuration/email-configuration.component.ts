import { Component, ViewChild,Input, EventEmitter, Output } from '@angular/core';
import { EmailConfigurationModalComponent } from '../email-configuration-modal/email-configuration-modal.component';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-email-configuration',
  templateUrl: './email-configuration.component.html',
  styleUrls: ['./email-configuration.component.scss']
})
export class EmailConfigurationComponent {

  @Input() setting_detail:any;
  @Output() email_data = new EventEmitter<any>();
  @ViewChild('emailConfigurationModal', { static: true }) emailConfigurationModal: EmailConfigurationModalComponent;

  constructor(public _helper:Helper) { }

  //open modal
  showEmailConfigurationModal() {
    this.emailConfigurationModal.show(this.setting_detail);
  }

  //emit data
  getSettingData(){
    this.email_data.emit();
  }

}
