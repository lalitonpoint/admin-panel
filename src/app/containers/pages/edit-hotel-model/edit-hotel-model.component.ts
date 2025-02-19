import { EXPORT_HISTORY_REQUEST_TYPE, PANEL_NAME, PANEL_TYPE } from '../../../constants/constants';
import { CommonService } from 'src/app/services/common.service';
import { Helper } from '../../../shared/helper';
import { DispatcherService } from '../../../services/dispatcher.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, AbstractControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import * as $ from "jquery";

declare const google: any;

@Component({
  selector: 'app-edit-hotel-model',
  templateUrl: './edit-hotel-model.component.html',
  styleUrls: ['./edit-hotel-model.component.scss']
})
export class EditHotelModelComponent implements OnInit {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  hotelSettingForm : UntypedFormGroup;
  form_data : FormData;
  PANEL_NAME = PANEL_NAME;
  PANEL_TYPE = PANEL_TYPE ;
  EXPORT_HISTORY_REQUEST_TYPE = EXPORT_HISTORY_REQUEST_TYPE;
  updateParameters = {};
  requestList : any ;
  listData : any ;
  hotel_id: string ;
  type: string ;
  timezone_for_display_date:string = '';
  name_error: boolean = false;

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService , private _fb : UntypedFormBuilder , private dispatcherService : DispatcherService , public _helper : Helper , private commonService : CommonService) {}

  ngOnInit(): void {
    this._helper.display_date_timezone.subscribe(data => {
      this.timezone_for_display_date = data;
    })
  }

  show(id , type): void {
    this.name_error = false;
    this.__initForm();

    if(id != ''){
      this.updateParameters['_id'] = id ;
      this.updateParameters['type'] = type ;
      this.hotel_id = id ;
      this.type = type ;
      this.commonService.fetchUpdateData(this.updateParameters).then((res_data : any)=>{
        this.requestList = res_data ;
        if(!res_data.is_show_email){
          this.hotelSettingForm.get('email').disable();
        }
        if(!res_data.is_show_phone){
          this.hotelSettingForm.get('country_phone_code').disable();
          this.hotelSettingForm.get('phone').disable();
        }
        if(res_data.success){
          this.modalRef = this.modalService.show(this.template, this.config);
          this.listData = res_data.type_detail[0];
          this.__patchValue();
        }
      })

    }
    if(!this._helper.has_permission(this._helper.PERMISSION.EDIT)){
      this.hotelSettingForm.disable();
    }
  }

  __initForm(){
    this.hotelSettingForm = this._fb.group({
      _id : new UntypedFormControl(''),
      hotel_name : new UntypedFormControl('',[Validators.required]),
      phone : new UntypedFormControl('',[Validators.required , Validators.minLength(this._helper.admin_setting_details?.minimum_phone_number_length ? this._helper.admin_setting_details.minimum_phone_number_length : 8), Validators.maxLength(this._helper.admin_setting_details?.maximum_phone_number_length ? this._helper.admin_setting_details.maximum_phone_number_length : 12)]),
      password : new UntypedFormControl('',[Validators.minLength(6)]),
      email : new UntypedFormControl(''),
      city : new UntypedFormControl(''),
      country : new UntypedFormControl(''),
      country_phone_code : new UntypedFormControl(''),
      address: new UntypedFormControl(null, [Validators.required]),
      cityLatitude: new UntypedFormControl(null, [Validators.required]),
      cityLongitude: new UntypedFormControl(null, [Validators.required]),
      type : new UntypedFormControl(''),
      admin_profit_type: new UntypedFormControl(null, [Validators.required]),
      admin_profit_value: new UntypedFormControl(null, [Validators.required]),
    })
  }

  __patchValue(){
    this.hotelSettingForm.patchValue({
      hotel_name : this.listData.hotel_name,
      phone : this.listData.phone,
      email : this.listData.email,
      city : this.listData.city,
      country : this.listData.country,
      country_phone_code : this.listData.country_phone_code,
      address: this.listData.address,
      cityLatitude: this.listData.latitude,
      cityLongitude: this.listData.longitude,
      admin_profit_type : this.listData.admin_profit_type,
      admin_profit_value : this.listData.admin_profit_value
    })
    setTimeout(() => {
      this._initAutocomplete();
    }, 500);
  }

  updateHotel(){
    if(this.name_error){
      return;
    }
    this.hotelSettingForm.patchValue({
      hotel_name: this.hotelSettingForm.value.hotel_name?.toString().trim(),
      password: this.hotelSettingForm.value.password?.toString().trim(),
      email: this.hotelSettingForm.value.email?.toString().trim(),
    })
    this.hotelSettingForm.markAllAsTouched();
    if(this.hotelSettingForm.valid){
      this.form_data = new FormData ;
      this.form_data.append('update_id' , this.hotel_id);
      this.form_data.append('hotel_name' , this.hotelSettingForm.value.hotel_name)
      if(this.hotelSettingForm.value.phone){
        this.form_data.append('phone' , this.hotelSettingForm.value.phone)
      }

      if(this.hotelSettingForm.value.password){
        this.form_data.append('password' , this.hotelSettingForm.value.password)
      }
      if(this.hotelSettingForm.value.email){
        this.form_data.append('email' , this.hotelSettingForm.value.email)
      }
      this.form_data.append('country' , this.hotelSettingForm.value.country)
      if(this.hotelSettingForm.value.country_phone_code){
        this.form_data.append('country_phone_code' , this.hotelSettingForm.value.country_phone_code)
      }
      this.form_data.append('address' , this.hotelSettingForm.value.address)
      this.form_data.append('latitude' , this.hotelSettingForm.value.cityLatitude)
      this.form_data.append('longitude' , this.hotelSettingForm.value.cityLongitude)
      this.form_data.append('type' , this.type)
      this.form_data.append('admin_profit_type' , this.hotelSettingForm.value.admin_profit_type)
      this.form_data.append('admin_profit_value' , this.hotelSettingForm.value.admin_profit_value)

      this.commonService.updateItemByType(this.form_data).then((res_data : any)=>{
        if(res_data.success){
          this.form_data = new FormData;
          this.modalRef.hide()
        }
      })
    }
  }

  getHistory(){
    let historyData = {
      _id  :  this.hotel_id ,
      type  :  this.PANEL_TYPE.HOTEL ,
      type_name : this.PANEL_NAME.HOTEL ,
      name :  this.listData.hotel_name ,
      export_request_type : this.EXPORT_HISTORY_REQUEST_TYPE.HOTEL
    }
    localStorage.setItem("historyData" , JSON.stringify(historyData))
    this.modalRef.hide();
    this._helper._route.navigate(['/app/users/hotel/history'])
  }

  _initAutocomplete(){
    let countrycode: string = (this.listData?.country_detail?.countrycode) ?? '';
    let autocompleteElm = <HTMLInputElement>document.getElementById('address');
    let autocomplete = new google.maps.places.Autocomplete((autocompleteElm), { componentRestrictions: { country: countrycode } });
    $('.search-address').find("#address").on("focus click keypress", () => {
      $('.search-address').css({ position: "relative" }).append($(".pac-container"));
    });
    autocomplete.addListener('place_changed', () => {
      let place = autocomplete.getPlace();
      let lat = place.geometry.location.lat();
      let lng = place.geometry.location.lng();

      this.hotelSettingForm.patchValue({
        cityLatitude: lat,
        cityLongitude: lng,
        address : place.formatted_address
      })
    });
  }

  setNewValidators(event){
    if(event == 2){

      this.hotelSettingForm.get('admin_profit_value').setValidators([Validators.required,this.profitValueValidation])
    }else{
      this.hotelSettingForm.get('admin_profit_value').clearValidators();
      this.hotelSettingForm.get('admin_profit_value').setValidators([Validators.required])
    }
    this.hotelSettingForm.get('admin_profit_value').updateValueAndValidity();
  }

  //profit value validation error message code
  profitValueValidation(control: AbstractControl): any {
    if(control.value <= 0){
      return { minValue: true }
    }
    if (control.value > 100) {
      return { profitValueInvalid: true }
    }
    return null
  }

  checkCharacterLimitvalidation(value) {
    this.name_error = this._helper.validateAndUpdateError(value, this._helper.maximum_full_name_character_limit);
  }
}
