import { Component, OnInit, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SettingsService } from 'src/app/services/settings.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-google-captcha-configuration-modal',
  templateUrl: './google-captcha-configuration-modal.component.html',
  styleUrls: ['./google-captcha-configuration-modal.component.scss']
})
export class GoogleCaptchaConfigurationModalComponent implements OnInit {
  googleCaptchaConfigurationForm: UntypedFormGroup;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };

  @Output() google_captcha_change_event = new EventEmitter<any>();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, public _helper: Helper, private _settingService: SettingsService) { }

  ngOnInit(): void {
    this._initForm();
  }

  //intialize form
  _initForm() {
    this.googleCaptchaConfigurationForm = new UntypedFormGroup({
      setting_id: new UntypedFormControl(null),
      recaptcha_secret_key_for_web: new UntypedFormControl(null),
      recaptcha_site_key_for_web: new UntypedFormControl(null),
      recaptcha_secret_key_for_android: new UntypedFormControl(null),
      recaptcha_site_key_for_android: new UntypedFormControl(null),
      recaptcha_secret_key_for_ios: new UntypedFormControl(null),
      recaptcha_site_key_for_ios: new UntypedFormControl(null),
    })
  }

  //get data from parent and open modal
  show(setting_detail): void {
    this._initForm();
    this.googleCaptchaConfigurationForm.patchValue(setting_detail)
    this.googleCaptchaConfigurationForm.patchValue({
      setting_id: setting_detail._id
    });
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  //update data
  update() {
    Object.keys(this.googleCaptchaConfigurationForm.controls).forEach((key) => {
      this.googleCaptchaConfigurationForm.get(key).setValue(this.googleCaptchaConfigurationForm.get(key).value.trim())
    });
    this._settingService.updateSettingDetails(this.googleCaptchaConfigurationForm.value).then(res => {
      if (res.success) {
        this.google_captcha_change_event.emit();
        this.closeModal();
      }
    })
  }

  closeModal() {
    this.modalRef.hide();
    setTimeout(() => {
      this.googleCaptchaConfigurationForm.reset();
    }, 200);
  }

}
