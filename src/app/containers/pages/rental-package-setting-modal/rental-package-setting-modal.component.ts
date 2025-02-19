import { Component, EventEmitter, HostListener, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TypeCityAssociationService } from 'src/app/services/type-city-association.service';
import { Helper } from 'src/app/shared/helper';
@Component({
  selector: 'app-rental-package-setting-modal',
  templateUrl: './rental-package-setting-modal.component.html',
  styleUrls: ['./rental-package-setting-modal.component.scss']
})
export class RentalPackageSettingModalComponent implements OnInit {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  btnDisable: boolean;
  rental_data: any;
  unit:string;
  currencysign: string;
  update_car_rental_id:string;
  rental_form: UntypedFormGroup;
  @Output() rentalHandler : EventEmitter<any> = new EventEmitter();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.code === 'Escape') {
      this.modalRef?.onHidden.subscribe(() => {
        setTimeout(() => {
          this.rental_data = null;
          this._initCountryForm();
        }, 500);
      })
    }
  }

  constructor(public _helper:Helper,private modalService: BsModalService, private typeCityService: TypeCityAssociationService) { }

  ngOnInit(): void {
    this._initCountryForm();
  }

  show(data, cityid, service_type_id, currencysign,unit): void {
    this.unit=unit;
    this.currencysign = currencysign;
    this.rental_form.patchValue({
      cityid: cityid, service_type_id: service_type_id
    })
    if (data) {
      this.update_car_rental_id=data.car_rental_details._id;
      this.rental_data = data.car_rental_details;
      this.rental_form.patchValue({
        ...this.rental_data
      })
    }
    this.modalRef = this.modalService.show(this.template, this.config);
  }
  //initialize form
  _initCountryForm() {
    let numericValidation = [
      Validators.required,
      Validators.min(1),
      Validators.max(99999)
    ]
    this.rental_form = new UntypedFormGroup({
      cityid: new UntypedFormControl(''),
      service_type_id: new UntypedFormControl(''),
      base_price: new UntypedFormControl(0, numericValidation),
      base_price_distance: new UntypedFormControl(0, numericValidation),
      typename: new UntypedFormControl(null, Validators.required),
      base_price_time: new UntypedFormControl(0, numericValidation),
      is_business: new UntypedFormControl(1),
      price_per_unit_distance: new UntypedFormControl(0, numericValidation),
      price_for_total_time: new UntypedFormControl(0, numericValidation),
      tax: new UntypedFormControl(0,[Validators.required,this.profitValueValidation])
    })
  }
  // rental package upadte & add
  submitRentalPrice() {
    if(this.rental_form.invalid){
      this.rental_form.markAllAsTouched();
      return;
    }
    if (this.rental_form.valid) {
      let updateForm = new FormData();
      updateForm.append('cityid', this.rental_form.value.cityid);
      updateForm.append('service_type_id', this.rental_form.value.service_type_id);
      updateForm.append('tax', this.rental_form.value.tax);
      updateForm.append('typename', this.rental_form.value.typename);
      updateForm.append('base_price_distance', this.rental_form.value.base_price_distance);
      updateForm.append('base_price_time', this.rental_form.value.base_price_time);
      updateForm.append('base_price', this.rental_form.value.base_price);
      updateForm.append('price_per_unit_distance', this.rental_form.value.price_per_unit_distance);
      updateForm.append('price_for_total_time', this.rental_form.value.price_for_total_time);
      if(this.rental_form.value.is_business){
        updateForm.append('is_business', '1');
      }else{
        updateForm.append('is_business', '0');
      }
      if (this.rental_data) {
        updateForm.append('update_car_rental_id', this.update_car_rental_id);
      } else {
        updateForm.append('is_car_rental_add', 'true');
      }
      this.btnDisable = true;
      this.typeCityService.updateRenatlPrice(updateForm).then(res => {
        if (res.success) {
          this.close();
          this.rentalHandler.emit();
          setTimeout(() => {
            this.rental_data=null;
            this.btnDisable = false;
          }, 500);
        }else{
          this.btnDisable = false;
        }
      })
    }
  }
  //profit value validation error message code 
  profitValueValidation(control: AbstractControl): any {
    if (control.value > 100) {
      return { profitValueInvalid: true }
    }
    return null
  }
  close() {
    this.modalRef.hide();
    setTimeout(() => {
      this.rental_data=null;
      this._initCountryForm();
    }, 1000);
  }
}
