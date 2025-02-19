import { DispatcherService } from '../../../services/dispatcher.service';
import { CountryService } from '../../../services/country.service';
import { CityService } from 'src/app/services/city.service';
import { Helper } from '../../../shared/helper';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-dispatcher-model',
  templateUrl: './add-dispatcher-model.component.html',
  styleUrls: ['./add-dispatcher-model.component.scss']
})
export class AddDispatcherModelComponent implements OnInit {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  commonForm: UntypedFormGroup;
  countryList : any ;
  country : any ;
  countryId: any;
  dispatcher_type : any ;
  cityList = [];
  selectedCities = [];
  first_name_error: boolean = false;
  last_name_error: boolean = false;

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService , public _helper : Helper , private countryService : CountryService , private dispatcherService : DispatcherService, private cityService : CityService ) { }

  ngOnInit(): void {
    this._initForm();
  }

  _initForm(){
    this.commonForm = new UntypedFormGroup({
      firstName: new UntypedFormControl(null, [Validators.required, Validators.minLength(2)]),
      LastName: new UntypedFormControl(null, [Validators.required, Validators.minLength(2)]),
      email: new UntypedFormControl(null, [Validators.required, Validators.email , Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')]),
      password: new UntypedFormControl(null, [Validators.required, Validators.minLength(6)]),
      countryphonecode : new UntypedFormControl(),
      country: new UntypedFormControl(null, [Validators.required]),
      city: new UntypedFormControl(null, [Validators.required]),
      phone: new UntypedFormControl(null, [Validators.required, Validators.minLength(this._helper.admin_setting_details?.minimum_phone_number_length ? this._helper.admin_setting_details.minimum_phone_number_length : 8), Validators.maxLength(this._helper.admin_setting_details?.maximum_phone_number_length ? this._helper.admin_setting_details.maximum_phone_number_length : 12)]),
    });
  }

  show(type): void {
    this.first_name_error = false;
    this.last_name_error = false;
    this._initForm();
    this.commonForm.reset();
    this.modalRef = this.modalService.show(this.template, this.config);
    this.dispatcher_type = type ;
    this.countryService.fetchCountry().then((res_data)=>{
      this.countryList = res_data.country_list;
    })
  }

  onSubmit(): void{
  }

  getCountry(country){
    this.countryId = country._id;
    this.country = country.countryname;
    this.commonForm.patchValue({
      countryphonecode : country.countryphonecode 
    })

    this.cityService.fetchDestinationCity({country_id : country._id}).then((res_data)=>{
      this.cityList = res_data.destination_list
    })
  }

  onAddNewDispatcher(){
    if(this.first_name_error || this.last_name_error){
      if (this.first_name_error) {
        document.getElementById('first_name')?.focus();
      } else if (!this.first_name_error && this.last_name_error) {
        document.getElementById('last_name')?.focus();
      }
      return;
    }
    this.commonForm.patchValue({
      firstName: this.commonForm.value.firstName?.toString().trim(),
      LastName: this.commonForm.value.LastName?.toString().trim(),
      email: this.commonForm.value.email?.toString().trim(),
      password: this.commonForm.value.password?.toString().trim(),
    })
    if(this.commonForm.invalid){
      this.commonForm.markAllAsTouched();
      return;
    }
    let form_data = new FormData ;
    form_data.append('first_name' , this.commonForm.value.firstName);
    form_data.append('last_name' , this.commonForm.value.LastName);
    form_data.append('email' , this.commonForm.value.email);
    form_data.append('country_phone_code' , this.commonForm.value.countryphonecode);
    form_data.append('phone' , this.commonForm.value.phone);
    form_data.append('password' , this.commonForm.value.password);
    form_data.append('country' , this.country);
    form_data.append('countryid', this.countryId);
    form_data.append('type' , this.dispatcher_type);
    form_data.append('city_ids' , JSON.stringify(this.commonForm.value.city));
    if(this.commonForm.valid){
      this.dispatcherService.addNewDispatcher(form_data).then((res_data : any)=>{
        if(res_data.success){
          this.modalRef.hide()
        }
      })
    }
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
