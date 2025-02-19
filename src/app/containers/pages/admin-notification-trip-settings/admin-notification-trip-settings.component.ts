import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SettingsService } from 'src/app/services/settings.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-admin-notification-trip-settings',
  templateUrl: './admin-notification-trip-settings.component.html',
  styleUrls: ['./admin-notification-trip-settings.component.scss']
})
export class AdminNotificationTripSettingsComponent implements OnInit {
  tripSettingsForm: UntypedFormGroup;
  settingsForm: UntypedFormGroup;
  is_edit_notification_settings = false;
  is_edit_settings = false;

  @Input() setting_detail:any;
  @Output() notification_setting_data = new EventEmitter<any>();

  constructor(public _helper: Helper, private _settingService: SettingsService) { }

  ngOnInit(): void {
    this._initForm();
    if(this.setting_detail == null){
      this.is_edit_notification_settings = true;
    }else{
      this.tripSettingsForm.disable();
    }
    this.tripSettingsForm.patchValue(this.setting_detail);
    this.tripSettingsForm.patchValue({
      setting_id:this.setting_detail._id
    });

    if(this.setting_detail == null){
      this.is_edit_settings = true;
    }else{
      this.settingsForm.disable();
    }
    this.settingsForm.patchValue(this.setting_detail);
    this.settingsForm.patchValue({
      setting_id:this.setting_detail._id
    });
  }

  //initialize form
  _initForm() {
    this.tripSettingsForm = new UntypedFormGroup({
      setting_id: new UntypedFormControl(null, Validators.required),
      userPath: new UntypedFormControl(null, Validators.required),
      providerPath: new UntypedFormControl(null, Validators.required),
      is_otp_verification_start_trip: new UntypedFormControl(null, Validators.required),
      twilio_call_masking: new UntypedFormControl(null, Validators.required),
      is_show_estimation_in_provider_app: new UntypedFormControl(null, Validators.required),
      is_show_estimation_in_user_app: new UntypedFormControl(null, Validators.required),
      is_tip: new UntypedFormControl(null, Validators.required),
      is_toll: new UntypedFormControl(null, Validators.required),
      is_show_user_details_in_provider_app: new UntypedFormControl(null, Validators.required),
    })

    this.settingsForm = new UntypedFormGroup({
      setting_id: new UntypedFormControl(null, Validators.required),
      sms_notification: new UntypedFormControl(null, Validators.required),
      email_notification: new UntypedFormControl(null, Validators.required),
      providerEmailVerification: new UntypedFormControl(null, Validators.required),
      userSms: new UntypedFormControl(null, Validators.required),
      providerSms: new UntypedFormControl(null, Validators.required),
      is_user_social_login: new UntypedFormControl(null, Validators.required),
      is_provider_social_login: new UntypedFormControl(null, Validators.required),
      is_user_login_using_otp: new UntypedFormControl(null, Validators.required),
      is_provider_login_using_otp: new UntypedFormControl(null, Validators.required),
      is_allow_biometric_verification_for_driver: new UntypedFormControl(null, Validators.required),
      is_use_captcha: new UntypedFormControl(null, Validators.required),
      is_allow_fake_gps: new UntypedFormControl(null, Validators.required),
      is_guest_token: new UntypedFormControl(null, Validators.required),
      is_banner_visible: new UntypedFormControl(false, Validators.required),
    })
  }

  //toggle between edit and save and on save click update data
  onClickNotificationSetting() {
    this.is_edit_notification_settings = !this.is_edit_notification_settings;
    if (this.is_edit_notification_settings) {
      this.tripSettingsForm.enable();
    } else {
      this.tripSettingsForm.disable();
      this._settingService.updateSettingDetails(this.tripSettingsForm.value).then(res => {
        if(res.success){
          this.notification_setting_data.emit();
        }
      });
    }
  }

  //toggle between edit and save and on save click update data
  onClickSetting() {
    this.is_edit_settings = !this.is_edit_settings;
    if (this.is_edit_settings) {
      this.settingsForm.enable();
    } else {
      this.settingsForm.disable();
      this._settingService.updateSettingDetails(this.settingsForm.value).then(res => {
        if(res.success){
          this.notification_setting_data.emit();
        }
      });
    }
  }

}
