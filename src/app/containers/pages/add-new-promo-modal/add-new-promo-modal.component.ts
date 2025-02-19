import { Component, OnInit, TemplateRef, ViewChild, Output, EventEmitter, HostListener } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UntypedFormGroup, UntypedFormControl, Validators, AbstractControl,ValidatorFn } from '@angular/forms';
import { CountryService } from 'src/app/services/country.service';
import { PromoService } from 'src/app/services/promo.service';
import { CityService } from 'src/app/services/city.service';
import { Helper } from 'src/app/shared/helper';
import { NotifiyService } from 'src/app/services/notifier.service';

export function timeRequired(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (!value) {
      return  { required: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-add-new-promo-modal',
  templateUrl: './add-new-promo-modal.component.html',
  styleUrls: ['./add-new-promo-modal.component.scss']
})
export class AddNewPromoModalComponent implements OnInit {
  commonForm: UntypedFormGroup;
  modalRef: BsModalRef;
  confirmModelRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  refundModelConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  todayDate: Date = new Date();
  promo_data: any;
  city_list: any;
  all_countries: [] = [];
  state = 1;
  user_used_promo = 0;
  subadmin_readonly:boolean=false;

  @Output() emit_promo_data = new EventEmitter<any>();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  @ViewChild('confirmationTemplate', { static: true }) confirmationTemplate: TemplateRef<any>;

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.code === 'Escape') {
      this.modalRef?.onHidden.subscribe(() => {
        this.closeModal();
      })
    }
  }

  constructor(private modalService: BsModalService, private _countryService: CountryService, private _promoService: PromoService, private _cityService: CityService,public _helper:Helper,private _notifiyService:NotifiyService) { }

  ngOnInit(): void {
    this._initForm();
    //get country list
    this._countryService.fetchCountry().then(res => {
      this.all_countries = res.country_list;
    })
  }

  //open modal and fetch data on edit
  show(promo): void {
    this.promo_data = null;
    this.commonForm.removeControl('promo_id');
    if (promo) {
      this.promo_data = promo;
      this._initForm();
      this.commonForm.patchValue(promo);

      let date = new Date(promo.start_date);
      let code_expiry = new Date(promo.code_expiry);

      this.commonForm.patchValue({
        start_date: date,
        code_expiry: code_expiry
      })
      this.getCityList(promo.countryid);
      this.onChangeCountry(promo.countryid);
      this.setNewValidators(promo.code_type);
      this.commonForm.controls.promocode.disable();
      this.commonForm.controls.country_name.disable();
    } else {
      this.commonForm.controls.promocode.enable();
      this.commonForm.controls.country_name.enable();
    }
    if(this.promo_data){
      if(!this._helper.has_permission(this._helper.PERMISSION.EDIT)){
        this.commonForm.disable();
      }
    }else{
      this.commonForm.enable();
    }
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  //initialize form
  _initForm() {
    this.commonForm = new UntypedFormGroup({
      promocode: new UntypedFormControl(null, [Validators.required]),
      state: new UntypedFormControl(null, [Validators.required]),
      code_type: new UntypedFormControl(null, [Validators.required]),
      code_value: new UntypedFormControl(null, [Validators.required]),
      code_uses: new UntypedFormControl(null, [Validators.required,Validators.min(1)]),
      country_name: new UntypedFormControl(null, [Validators.required]),
      countryid: new UntypedFormControl(null, [Validators.required]),
      cityid: new UntypedFormControl([], [Validators.required]),
      start_date: new UntypedFormControl(null, [timeRequired()]),
      code_expiry: new UntypedFormControl(null, [timeRequired()]),
      completed_trips_type: new UntypedFormControl(null, [Validators.required]),
      completed_trips_value: new UntypedFormControl(null, [Validators.required]),
      user_used_promo: new UntypedFormControl(null, [Validators.required]),
      description: new UntypedFormControl(null, [Validators.required]),
    });

    if (this.promo_data) {
      this.commonForm.addControl('promo_id', new UntypedFormControl(null, Validators.required))
    }
  }

  //change country and get city of that country
  onChangeCountry(data) {
    this._countryService.fetchCountry().then(res => {
      res.country_list.forEach((country) => {
        if (data) {
          if (data == country._id) {
            this.commonForm.patchValue({
              country_name: country.countryname
            })
          }
        } else {
          this.commonForm.patchValue({
            cityid: ''
          })
          if (country.countryname == this.commonForm.value.country_name) {
            this.commonForm.patchValue({
              countryid: country._id,
            })
            this.getCityList(this.commonForm.value.countryid);
          }
        }
      })
    })
  }

  //get city from country
  getCityList(country_id) {
    let json: any = { country_id: country_id };
    this._cityService.fetchDestinationCity(json).then(city => {
      if (city.success) {
        this.city_list = city.destination_list;
      }
    })
  }

  //add or update
  submit() {
    let start_date_milliseconds = new Date(new Date(this.commonForm.value.start_date).toISOString()).getTime();
    let code_expiry_milliseconds = new Date(new Date(this.commonForm.value.code_expiry).toISOString()).getTime();
    if(start_date_milliseconds > code_expiry_milliseconds){
      this._notifiyService.showNotification('error',this._helper.trans.instant('validation-title.please-enter-valid-date'))
      return;
    }
    if (this.promo_data) {
      if(this.promo_data.code_uses > this.commonForm.value.code_uses) {
        this._notifiyService.showNotification('error',this._helper.trans.instant('validation-title.please-enter-larger-than-previous'))
        return;
      }
      if (this.commonForm.value.state) {
        this.state = 1;
      } else {
        this.state = 0;
      }

      this.commonForm.patchValue({
        state: this.state,
        promo_id: this.promo_data._id,
        description: this.commonForm.value.description?.toString().trim(),
      })
      if (this.commonForm.invalid) {
        this.commonForm.markAllAsTouched();
        return;
      } else {
        this._promoService.updatePromo(this.commonForm.value).then(res => {
          if (res.success) {
            this.emit_promo_data.emit();
            this.closeModal();
          }
        })
      }
    } else {
      this.commonForm.patchValue({
        state: this.state,
        user_used_promo: this.user_used_promo,
        description: this.commonForm.value.description?.toString().trim(),
      })
      if (this.commonForm.invalid) {
        this.commonForm.markAllAsTouched();
        return;
      } else {
        this._promoService.addPromo(this.commonForm.value).then(res => {
          if (res.success) {
            this.emit_promo_data.emit();
            this.closeModal();
          }
        })
      }
    }
  }

  //delete promo
  deletePromo() {
    this.confirmModelRef = this.modalService.show(this.confirmationTemplate, this.refundModelConfig);
  }

  confirm(){
    let json: any = { promo_id: this.promo_data._id }
    this._promoService.deletePromo(json).then(res => {
      if (res.success) {
        this.emit_promo_data.emit();
        this.closeModal();
        this.cancel();
      }
    })
  }

  //cancel trip modal close
  cancel(){
    this.confirmModelRef.hide()
  }

  closeModal() {
    this.modalRef?.hide();
    setTimeout(() => {
      this.commonForm.reset();
      this.promo_data = null;
    }, 500);
  }

  setNewValidators(event){
    if(event == 2){
      this.commonForm.get('code_value').setValidators([Validators.required,this.profitValueValidation])
    }else{
      this.commonForm.get('code_value').clearValidators();
      this.commonForm.get('code_value').setValidators([Validators.required])
    }
    this.commonForm.get('code_value').updateValueAndValidity();
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

}
