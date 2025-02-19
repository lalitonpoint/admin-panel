import { Helper } from '../../../shared/helper';
import { CommonService } from 'src/app/services/common.service';
import { DispatcherService } from '../../../services/dispatcher.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UntypedFormGroup, UntypedFormControl, Validators, AbstractControl } from '@angular/forms';
import { PANEL_NAME, PANEL_TYPE , EXPORT_HISTORY_REQUEST_TYPE } from 'src/app/constants/constants';

@Component({
  selector: 'app-corporate-modal',
  templateUrl: './corporate-modal.component.html',
  styleUrls: ['./corporate-modal.component.scss']
})
export class CorporateModalComponent implements OnInit {
  btn = true;
  modalRef: BsModalRef;
  confirmModelRef: BsModalRef;
  addWalletModelRef : BsModalRef ;
  corporateSettingForm: UntypedFormGroup;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  confirmationModalConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  PANEL_NAME = PANEL_NAME ;
  PANEL_TYPE = PANEL_TYPE ;
  EXPORT_HISTORY_REQUEST_TYPE = EXPORT_HISTORY_REQUEST_TYPE ;
  listData : any ;
  updateParameters = {};
  requestList : any ;
  form_data: FormData;
  corporate_id: string ;
  type: string | Blob;
  deleteById = {};
  walletDetail = {} ;
  wallet_amount: any = 0
  max_number = 9999
  isError:boolean = false;
  corporateStatus : boolean ;
  is_show_phone : boolean ;
  is_show_email : boolean ;
  data: any;
  timezone_for_display_date:string = '';
  name_error: boolean = false;

  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  @ViewChild('addWalletModelTemplate', { static: true }) addWalletModelTemplate: TemplateRef<any>;
  @ViewChild('confirmationTemplate', { static: true }) confirmationTemplate: TemplateRef<any>;

  constructor(private modalService: BsModalService ,  private dispatcherService : DispatcherService  , private commonService : CommonService , public _helper : Helper) { }

  ngOnInit(): void {
    this._helper.display_date_timezone.subscribe(data => {
      this.timezone_for_display_date = data;
    })
  }

  show(id , type , status): void {
    this.name_error = false;
    this._initForm();
    if(id != ''){
      this.updateParameters['_id'] = id ;
      this.updateParameters['type'] = type ;
      this.corporate_id = id ;
      this.type = type ;
      this.corporateStatus = status ;
      this.commonService.fetchUpdateData(this.updateParameters).then((res_data : any)=>{
        if(!res_data.is_show_email){
          this.corporateSettingForm.get('email').disable()
        }
        if(!res_data.is_show_phone){
          this.corporateSettingForm.get('country_phone_code').disable()
          this.corporateSettingForm.get('phone').disable()
        }
        if(res_data.success){
          this.modalRef = this.modalService.show(this.template, this.config);
          this.requestList = res_data ;
          this.listData = res_data.type_detail[0] ;
          this._patchForm();
        }
      })

    }
    if(!this._helper.has_permission(this._helper.PERMISSION.EDIT)){
      this.corporateSettingForm.disable();
    }
  }

  _initForm(){
    this.corporateSettingForm = new UntypedFormGroup({
      name: new UntypedFormControl(null, [Validators.required]),
      phone: new UntypedFormControl(null, [Validators.required , Validators.minLength(this._helper.admin_setting_details?.minimum_phone_number_length ? this._helper.admin_setting_details.minimum_phone_number_length : 8), Validators.maxLength(this._helper.admin_setting_details?.maximum_phone_number_length ? this._helper.admin_setting_details.maximum_phone_number_length : 12)]),
      email: new UntypedFormControl(null, [Validators.required]),
      password: new UntypedFormControl(null, [ Validators.minLength(6)]),
      country: new UntypedFormControl(null, [Validators.required]),
      country_phone_code : new UntypedFormControl(null),
      admin_profit_type: new UntypedFormControl(null, [Validators.required]),
      admin_profit_value: new UntypedFormControl(null, [Validators.required]),
    });
  }

  _patchForm(){
    this.corporateSettingForm.patchValue({
      name : this.listData.name,
      phone : this.listData.phone,
      email : this.listData.email,
      country : this.listData.country_name,
      country_phone_code : this.listData.country_phone_code,
      admin_profit_type : this.listData.admin_profit_type,
      admin_profit_value : this.listData.admin_profit_value
    })
  }

  updateCorporate(){
    if(this.name_error){
      document.getElementById('name')?.focus();
      return;
    }
    this.corporateSettingForm.patchValue({
      name: this.corporateSettingForm.value.name?.toString().trim(),
      password: this.corporateSettingForm.value.password?.toString().trim(),
      email: this.corporateSettingForm.value.email?.toString().trim(),
    })
    this.corporateSettingForm.markAllAsTouched();
    if(this.corporateSettingForm.valid){
      this.form_data = new FormData
      this.form_data = new FormData ;
      this.form_data.append('update_id' , this.corporate_id);
      this.form_data.append('name' , this.corporateSettingForm.value.name)
      if(this.corporateSettingForm.value.phone){
        this.form_data.append('phone' , this.corporateSettingForm.value.phone)
      }
      if(this.corporateSettingForm.value.password){
        this.form_data.append('password' , this.corporateSettingForm.value.password)
      }
      if(this.corporateSettingForm.value.email){
        this.form_data.append('email' , this.corporateSettingForm.value.email)
      }
      this.form_data.append('country' , this.corporateSettingForm.value.country)
      if(this.corporateSettingForm.value.country_phone_code){
        this.form_data.append('country_phone_code' , this.corporateSettingForm.value.country_phone_code)
      }
      this.form_data.append('type' , this.type)
      this.form_data.append('admin_profit_type' , this.corporateSettingForm.value.admin_profit_type)
      this.form_data.append('admin_profit_value' , this.corporateSettingForm.value.admin_profit_value)

      this.commonService.updateItemByType(this.form_data).then((res_data : any)=>{
        if(res_data.success){
          this.modalRef.hide()
        }
      })
    }
  }

  deleteItem(){
    this.confirmModelRef = this.modalService.show(this.confirmationTemplate, this.confirmationModalConfig);
  }

  cancel(){
    this.confirmModelRef.hide()
  }

  async confirm(){
    this.deleteById['type'] = this.type ;
    this.deleteById['delete_id'] = this.corporate_id ;
    await this.commonService.deleteAndUpadateItem(this.deleteById).then((res_data)=>{
      this.confirmModelRef.hide()
    })
  }

  onAddWallet(){
     this.addWalletModelRef = this.modalService.show(this.addWalletModelTemplate, this.confirmationModalConfig);
  }

  addWalletAmount(amount){
    this.walletDetail['type'] = this.type ;
    this.walletDetail['wallet_amount'] = amount.toString() ;
    this.walletDetail['type_id'] = this.corporate_id ;
    this.commonService.addWallet(this.walletDetail).then((res_data)=>{
      this.addWalletModelRef.hide();
      this.wallet_amount = 0;
    })
  }

  wallet_amount_validator(event){
    if(this.wallet_amount > this.max_number){
      this.isError = true
      return false
    } else {
      this.isError = false
    }
  }

  getHistory(){
    let historyData = {
      _id  :  this.corporate_id ,
      type  :  this.PANEL_TYPE.CORPORATE ,
      type_name : this.PANEL_NAME.CORPORATE ,
      name :  this.listData.name ,
      export_request_type : this.EXPORT_HISTORY_REQUEST_TYPE.CORPORATE
    }
    localStorage.setItem("historyData" , JSON.stringify(historyData))
    this.modalRef.hide();
    this._helper._route.navigate(['/app/users/corporate/history'])
  }

  getUser(){
    let historyData = {
      _id  :  this.corporate_id ,
      type_name : this.PANEL_NAME.CORPORATE ,
      name :  this.listData.name ,
      export_request_type : this.EXPORT_HISTORY_REQUEST_TYPE.CORPORATE
    }
    localStorage.setItem("historyData" , JSON.stringify(historyData))
    this._helper.selected_id = this.corporate_id;
    this.modalRef.hide();
    this._helper._route.navigate(['/app/users/user'])
  }

  setNewValidators(event){
    if(event == 2){
      this.corporateSettingForm.get('admin_profit_value').setValidators([Validators.required,this.profitValueValidation])
    }else{
      this.corporateSettingForm.get('admin_profit_value').clearValidators();
      this.corporateSettingForm.get('admin_profit_value').setValidators([Validators.required])
    }
    this.corporateSettingForm.get('admin_profit_value').updateValueAndValidity();
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
