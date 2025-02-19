import { Component, OnInit, Output, TemplateRef, ViewChild,EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SettingsService } from 'src/app/services/settings.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-sms-configuration-modal',
  templateUrl: './sms-configuration-modal.component.html',
  styleUrls: ['./sms-configuration-modal.component.scss']
})
export class SmsConfigurationModalComponent implements OnInit {
  smsConfigurationForm: UntypedFormGroup;
  modalRef:BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };

  @Output() SMS_data = new EventEmitter<any>();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService,public _helper:Helper,private _settingService:SettingsService) { }

  ngOnInit(): void {
    this._initForm();
  }

  //initialize form
  _initForm() {
    this.smsConfigurationForm = new UntypedFormGroup ({
      setting_id: new UntypedFormControl(null),
      twilio_account_sid: new UntypedFormControl(null),
      twilio_auth_token: new UntypedFormControl(null),
      twilio_number: new UntypedFormControl(null),
      twiml_url: new UntypedFormControl(null),
    })
  }

  //get data from parent and open modal
  show(setting_detail): void {
    this.smsConfigurationForm.patchValue(setting_detail);
    this.smsConfigurationForm.patchValue({
      setting_id:setting_detail._id
    });
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  //update
  update(){
    Object.keys(this.smsConfigurationForm.controls).forEach((key) => this.smsConfigurationForm.get(key).setValue(this.smsConfigurationForm.get(key).value.trim()));
    this._settingService.updateSettingDetails(this.smsConfigurationForm.value).then(res => {
      if(res.success){
        this.closeModal();
        this.SMS_data.emit();
      }
    })
  }

  closeModal(){
    this.modalRef.hide()
    setTimeout(() => {
      this.smsConfigurationForm.reset();
    }, 1000);
  }

}
