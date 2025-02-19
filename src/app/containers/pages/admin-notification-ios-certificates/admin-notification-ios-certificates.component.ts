import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { NotifiyService } from 'src/app/services/notifier.service';
import { SettingsService } from 'src/app/services/settings.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-admin-notification-ios-certificates',
  templateUrl: './admin-notification-ios-certificates.component.html',
  styleUrls: ['./admin-notification-ios-certificates.component.scss']
})
export class AdminNotificationIosCertificatesComponent implements OnInit {

  iosCertificateForm: UntypedFormGroup;
  push_p8_file:any;
  is_edit_ios_certificate_settings = false;
  
  @Input() setting_detail: any;
  @Output() ios_certificate_data = new EventEmitter<any>();

  constructor(private _settingService: SettingsService,public _helper:Helper,private _notifierService:NotifiyService) { }

  ngOnInit(): void {
    this._initForm();
    if (this.setting_detail == null) {
      this.is_edit_ios_certificate_settings = true;
    } else {
      this.iosCertificateForm.disable();
    }
    this.iosCertificateForm.patchValue(this.setting_detail);
    this.iosCertificateForm.patchValue({
      setting_id: this.setting_detail._id
    });
  }

  _initForm() {
    this.iosCertificateForm = new UntypedFormGroup({
      setting_id: new UntypedFormControl(null),
      ios_certificate_mode: new UntypedFormControl(null),
      // file: new FormControl(null, Validators.required),
      user_bundle_id: new UntypedFormControl(null),
      provider_bundle_id: new UntypedFormControl(null),
      team_id: new UntypedFormControl(null),
      key_id: new UntypedFormControl(null),
    })
  }

  onSelectFile(event){
    const files = event.target.files;
    if (files.length === 0)
      return;

    const fileType = files[0].type;
    
    if (fileType !== '' && fileType !== "application/pkcs8") {
      this._notifierService.showNotification('error', this._helper.trans.instant('validation-title.please-select-valid-file-with-p8-extension'))
      return;
    }

    this.push_p8_file = files[0];
  }

  onRemoveSelectedFile(){
    this.push_p8_file = null
    let fileInput:any = document.getElementById("i-certi")
    fileInput.value = "";
  }

  onClickIOSCertificatesSetting(): void {
    this.is_edit_ios_certificate_settings = !this.is_edit_ios_certificate_settings;
    if (this.is_edit_ios_certificate_settings) {
      this.iosCertificateForm.enable();
    } else {
      this.iosCertificateForm.disable();
      this._settingService.updateSettingDetails(this.iosCertificateForm.value).then(res => {
        if(res.success){
          this.ios_certificate_data.emit();
        }
      })
    }
  }

}
