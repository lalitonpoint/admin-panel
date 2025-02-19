import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Helper } from 'src/app/shared/helper';
import { CommonService } from 'src/app/services/common.service';
import { SettingsService } from 'src/app/services/settings.service';
import { CountryService } from 'src/app/services/country.service';

@Component({
  selector: 'app-basic-and-trip-setting-modal',
  templateUrl: './basic-and-trip-setting-modal.component.html',
  styleUrls: ['./basic-and-trip-setting-modal.component.scss']
})
export class BasicAndTripSettingsModalComponent implements OnInit {
  modalRef: BsModalRef;
  commonForm: UntypedFormGroup;
  formData: FormData = new FormData();
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  timezone_list: [] = [];
  all_countries: [] = [];
  setting_id: string;
  type: number;
  minimum_phone_number_length_error: string = '';
  maximum_phone_number_length_error: string = '';

  @Output() basic_setting_data = new EventEmitter<any>();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, public _helper: Helper, private _commonService: CommonService, private _settingService: SettingsService, private _countryService: CountryService) { }

  ngOnInit(): void {
    //get timezone from country
    this._commonService.getCountryTimezone().then((res) => {
      this.timezone_list = res.timezone_list;
    })
    // get country list
    this._countryService.fetchCountry().then(res => {
      this.all_countries = res.country_list;
    })
  }

  //initialize form
  _initForm() {
    if (this.type == 1) {
      this.commonForm = new UntypedFormGroup({
        countryname: new UntypedFormControl(null, [Validators.required]),
        adminCurrencyCode: new UntypedFormControl(null, [Validators.required]),
        adminCurrency: new UntypedFormControl(null, [Validators.required]),
        adminTimeZone: new UntypedFormControl(null, [Validators.required]),
        timezone_for_display_date: new UntypedFormControl(null, [Validators.required]),
        admin_phone: new UntypedFormControl(null, [Validators.required, Validators.minLength(this._helper.admin_setting_details?.minimum_phone_number_length ? this._helper.admin_setting_details.minimum_phone_number_length : 8), Validators.maxLength(this._helper.admin_setting_details?.maximum_phone_number_length ? this._helper.admin_setting_details.maximum_phone_number_length : 12)]),
        admin_email: new UntypedFormControl(null, [Validators.required, Validators.email]),
        contactUsEmail: new UntypedFormControl(null, [Validators.required, Validators.email]),
        latitude: new UntypedFormControl(null, [Validators.required]),
        longitude: new UntypedFormControl(null, [Validators.required]),
        provider_offline_min: new UntypedFormControl(null, [Validators.required, Validators.min(1)]),
        minimum_phone_number_length: new UntypedFormControl(null, [Validators.required]),
        maximum_phone_number_length: new UntypedFormControl(null, [Validators.required]),
        decimal_point_value: new UntypedFormControl(null, [Validators.required]),
        driver_panel_url: new UntypedFormControl(null, [Validators.pattern('^(https?)://[^\s/$.?#].[^\s]*$')])
      });
    } else {
      this.commonForm = new UntypedFormGroup({
        provider_timeout: new UntypedFormControl(null, [Validators.required, Validators.min(1), Validators.maxLength(4)]),
        default_Search_radious: new UntypedFormControl(null, [Validators.required, Validators.min(1), Validators.maxLength(4)]),
        scheduled_request_pre_booking_days: new UntypedFormControl(null, [Validators.required, Validators.min(1)]),
        scheduled_request_pre_start_minute: new UntypedFormControl(null, [Validators.required, Validators.min(1)]),
        number_of_try_for_scheduled_request: new UntypedFormControl(null, [Validators.required, Validators.min(1)]),
        find_nearest_driver_type: new UntypedFormControl(null, [Validators.required]),
        request_send_to_no_of_providers: new UntypedFormControl(null, [Validators.required, Validators.min(1)]),
        rental_trip_pre_notification_time: new UntypedFormControl(null, [Validators.required, Validators.min(1)]),
      });
    }
  }

  //get data from parent and open modal
  show(setting_detail, type): void {//type 1.basic settings 2.trip settings
    this.minimum_phone_number_length_error = '';
    this.maximum_phone_number_length_error = '';
    this.type = type;
    this._initForm();
    this.setting_id = setting_detail._id;
    this.commonForm.patchValue(setting_detail);
    if (this.type == 1) {
      this.commonForm.patchValue({
        latitude: setting_detail.location[0],
        longitude: setting_detail.location[1],
      })
      if (this.commonForm.value.countryname) {
        this.commonForm.controls.countryname.disable();
      }
    }
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  //on country select change data according to country 
  onChangeCountry() {
    this._countryService.fetchCountry().then(res => {
      res.country_list.forEach((country) => {
        if (country.countryname == this.commonForm.value.countryname) {
          this.commonForm.patchValue({
            adminCurrencyCode: country.currencycode,
            adminCurrency: country.currencysign,
            adminTimeZone: country.countrytimezone
          })
        }
      })
    })
  }

  //append data and update
  update() {
    if (this.commonForm.invalid || this.minimum_phone_number_length_error != '' || this.maximum_phone_number_length_error != '') {
      if (this.maximum_phone_number_length_error != '') {
        document.getElementById('max_phoneno_length')?.focus();
      }
      if (this.minimum_phone_number_length_error != '') {
        document.getElementById('min_phoneno_length')?.focus();
      }
      this.commonForm.markAllAsTouched();
      return;
    }

    let location: any[] = [];
    location.push(this.commonForm.value.latitude);
    location.push(this.commonForm.value.longitude);
    this.formData = new FormData();
    this.formData.append('setting_id', this.setting_id);
    if (this.type == 1) {
      this.formData.append('countryname', this.commonForm.getRawValue().countryname);//when disable control its value becomes undefined so use getRawValue
      this.formData.append('adminCurrencyCode', this.commonForm.value.adminCurrencyCode);
      this.formData.append('adminCurrency', this.commonForm.value.adminCurrency);
      this.formData.append('adminTimeZone', this.commonForm.value.adminTimeZone);
      this.formData.append('timezone_for_display_date', this.commonForm.value.timezone_for_display_date);
      this.formData.append('admin_phone', this.commonForm.value.admin_phone);
      this.formData.append('admin_email', this.commonForm.value.admin_email);
      this.formData.append('contactUsEmail', this.commonForm.value.contactUsEmail);
      this.formData.append('location', JSON.stringify(location));
      this.formData.append('provider_offline_min', this.commonForm.value.provider_offline_min);
      this.formData.append('minimum_phone_number_length', this.commonForm.value.minimum_phone_number_length);
      this.formData.append('maximum_phone_number_length', this.commonForm.value.maximum_phone_number_length);
      this.formData.append('decimal_point_value', this.commonForm.value.decimal_point_value);
      this.formData.append('driver_panel_url', this.commonForm.value.driver_panel_url);
    }else{
      this.formData.append('provider_timeout', this.commonForm.value.provider_timeout);
      this.formData.append('default_Search_radious', this.commonForm.value.default_Search_radious);
      this.formData.append('scheduled_request_pre_booking_days', this.commonForm.value.scheduled_request_pre_booking_days);
      this.formData.append('scheduled_request_pre_start_minute', this.commonForm.value.scheduled_request_pre_start_minute);
      this.formData.append('number_of_try_for_scheduled_request', this.commonForm.value.number_of_try_for_scheduled_request);
      this.formData.append('find_nearest_driver_type', this.commonForm.value.find_nearest_driver_type);
      this.formData.append('request_send_to_no_of_providers', this.commonForm.value.request_send_to_no_of_providers);
      this.formData.append('rental_trip_pre_notification_time', this.commonForm.value.rental_trip_pre_notification_time);
    }

    this._settingService.updateSettingDetails(this.formData).then((response) => {
      if (response.success) {
        this.closeModal();
        this.basic_setting_data.emit();
      }
    })
  }

  closeModal() {
    this.modalRef.hide();
    setTimeout(() => {
      this.commonForm.reset();
      this.formData = new FormData();
    }, 1000);
  }

  checkMinMaxPhoneLengthValidation(type: number) {//type 1.min phone length 2.max phone length
    this.minimum_phone_number_length_error = '';
    this.maximum_phone_number_length_error = '';
    if (type == 1) {
      if (this.commonForm.value.minimum_phone_number_length > this.commonForm.value.maximum_phone_number_length) {
        this.minimum_phone_number_length_error = 'validation-title.minimum-phone-no-length-must-be-less-than-or-equel-to-maximum-phone-number-length';
        document.getElementById('min_phoneno_length')?.focus();
        return;
      }
    } else if (this.commonForm.value.maximum_phone_number_length < this.commonForm.value.minimum_phone_number_length) {
      this.maximum_phone_number_length_error = 'validation-title.maximum-phone-no-length-must-be-greater-than-or-equel-to-minimum-phone-number-length';
      document.getElementById('max_phoneno_length')?.focus();
      return;
    }
    this.minimum_phone_number_length_error = '';
    this.maximum_phone_number_length_error = '';
  }

}
