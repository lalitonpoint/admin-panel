import { EXPORT_HISTORY_REQUEST_TYPE, PANEL_NAME, PANEL_TYPE } from '../../../constants/constants';
import { CommonService } from 'src/app/services/common.service';
import { Helper } from '../../../shared/helper';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DetailsModel } from 'src/app/models/user.model';
import { CityService } from 'src/app/services/city.service';

@Component({
  selector: 'app-edit-dispatcher-modal',
  templateUrl: './edit-dispatcher-modal.component.html',
  styleUrls: ['./edit-dispatcher-modal.component.scss']
})
export class EditDispatcherModalComponent implements OnInit {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  dispactherSettingForm: UntypedFormGroup;
  bankDetailForm: UntypedFormGroup;
  form_data: FormData;
  dispatcher_detail: DetailsModel = {
    _id: '',
    first_name: '',
    last_name: '',
    phone: '',
    country_phone_code: '',
    email: '',
    password: '',
    is_use_wallet: false,
    wallet_currency_code: '',
    type: '',
    picture: '',
    is_approved: false,
    is_document_uploaded: false,
    is_email_verified: false,
    is_phone_number_verified: false,
    cart_id: '',
    login_by: '',
    token: '',
    country_code: '',
    country_id: '',
    country: ''
  };
  list_data: any;
  PANEL_NAME = PANEL_NAME ;
  PANEL_TYPE = PANEL_TYPE ;
  EXPORT_HISTORY_REQUEST_TYPE = EXPORT_HISTORY_REQUEST_TYPE;
  updateParameters = {};
  request_list: any;
  type: any;
  dispatcher_id: any;
  city_list = [];
  timezone_for_display_date:string = '';
  first_name_error: boolean = false;
  last_name_error: boolean = false;

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, private _fb: UntypedFormBuilder, public _helper: Helper, private commonService: CommonService, private _cityService: CityService) { }

  ngOnInit(): void {
    this._helper.display_date_timezone.subscribe(data => {
      this.timezone_for_display_date = data;
    })
  }

  show(data, type): void {
    this.first_name_error = false;
    this.last_name_error = false;
    this._initForm();
    if (data != '') {
      this.updateParameters['_id'] = data;
      this.updateParameters['type'] = type;
      this.type = type;
      this.dispatcher_id = data;
      this.commonService.fetchUpdateData(this.updateParameters).then((res_data: any) => {
        if(!res_data.is_show_email){
          this.dispactherSettingForm.get('email').disable()
        }
        if(!res_data.is_show_phone){
          this.dispactherSettingForm.get('country_phone_code').disable()
          this.dispactherSettingForm.get('phone').disable()
        }
        if(res_data.success){
          this.modalRef = this.modalService.show(this.template, this.config);
          this.request_list = res_data;
          this.list_data = res_data.type_detail[0];
          this.getCityList(res_data.type_detail[0].country)
          
          this._patchForm();
        }
      })

    }
    if(!this._helper.has_permission(this._helper.PERMISSION.EDIT)){
      this.dispactherSettingForm.disable();
    }
  }

  _initForm() {
    this.dispactherSettingForm = this._fb.group({
      id: new UntypedFormControl(),
      first_name: new UntypedFormControl(null, Validators.required),
      last_name: new UntypedFormControl(null, Validators.required),
      phone: new UntypedFormControl(null, [Validators.required, Validators.minLength(this._helper.admin_setting_details?.minimum_phone_number_length ? this._helper.admin_setting_details.minimum_phone_number_length : 8), Validators.maxLength(this._helper.admin_setting_details?.maximum_phone_number_length ? this._helper.admin_setting_details.maximum_phone_number_length : 12)]),
      password: new UntypedFormControl(null, [Validators.minLength(6)]),
      email: new UntypedFormControl(null, Validators.required),
      country: new UntypedFormControl(null, Validators.required),
      city: new UntypedFormControl(null, Validators.required),
      country_phone_code: new UntypedFormControl(null),
      type: new UntypedFormControl(null)
      // country_phone_code : new FormControl(null)
    })
  }

  _patchForm() {
    this.dispactherSettingForm.patchValue({
      first_name: this.list_data.first_name,
      last_name: this.list_data.last_name,
      phone: this.list_data.phone,
      email: this.list_data.email,
      country: this.list_data.country,
      country_phone_code: this.list_data.country_phone_code,
      city: this.list_data.city_ids
    })
  }

  updateAccount(value) {
    if(this.first_name_error || this.last_name_error){
      if (this.first_name_error) {
        document.getElementById('first_name')?.focus();
      } else if (!this.first_name_error && this.last_name_error) {
        document.getElementById('last_name')?.focus();
      }
      return;
    }
    this.dispactherSettingForm.patchValue({
      first_name: this.dispactherSettingForm.value.first_name?.toString().trim(),
      last_name: this.dispactherSettingForm.value.last_name?.toString().trim(),
      password: this.dispactherSettingForm.value.password?.toString().trim(),
      email: this.dispactherSettingForm.value.email?.toString().trim(),
    })
    this.dispactherSettingForm.markAllAsTouched();
    if (this.dispactherSettingForm.valid) {
      this.form_data = new FormData;
      this.form_data.append('update_id', this.dispatcher_id);
      this.form_data.append('first_name', this.dispactherSettingForm.value.first_name)
      this.form_data.append('last_name', this.dispactherSettingForm.value.last_name)
      if(this.dispactherSettingForm.value.phone){
        this.form_data.append('phone', this.dispactherSettingForm.value.phone)
      }
      if (this.dispactherSettingForm.value.password) {
        this.form_data.append('password', this.dispactherSettingForm.value.password)
      }
      if(this.dispactherSettingForm.value.email){
        this.form_data.append('email', this.dispactherSettingForm.value.email)
      }
      this.form_data.append('country', this.dispactherSettingForm.value.country)
      if(this.dispactherSettingForm.value.country_phone_code){
        this.form_data.append('country_phone_code', this.dispactherSettingForm.value.country_phone_code)
      }
      this.form_data.append('type', this.type)
      this.form_data.append('city_ids', JSON.stringify(this.dispactherSettingForm.value.city))

      this.commonService.updateItemByType(this.form_data).then((res_data : any) => {
        if(res_data.success){
          this.modalRef.hide()
        }
      })
    }
  }

  getHistory() {
    let historyData = {
      _id  :  this.dispatcher_id ,
      type  :  this.PANEL_TYPE.DISPATCHER ,
      type_name : this.PANEL_NAME.DISPATCHER ,
      name :  this.list_data.first_name + ' ' +  this.list_data.last_name ,
      export_request_type : this.EXPORT_HISTORY_REQUEST_TYPE.DISPATCHER
    }
    localStorage.setItem("historyData" , JSON.stringify(historyData))
    this.modalRef.hide();
    this._helper._route.navigate(['/app/users/dispatcher/history'])
  }

  getCityList(country_id) {
    let json: any = { countryname: country_id };
    this._cityService.fetchDestinationCity(json).then(city => {
      if (city.success) {
        this.city_list = city.destination_list;
      }
    })
  }

  checkCharacterLimitvalidation(value, type) {
    if (type == this._helper.NAME_TYPE.FIRST_NAME) {
      this.first_name_error = this._helper.validateAndUpdateError(value, this._helper.maximum_first_name_character_limit);
    }
    if (type == this._helper.NAME_TYPE.LAST_NAME) {
      this.last_name_error = this._helper.validateAndUpdateError(value, this._helper.maximum_last_name_character_limit);
    }
  }

}
