import { Component, EventEmitter, HostListener, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CarRentServiceService } from 'src/app/services/car-rent-service.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-rent-car-type-model',
  templateUrl: './rent-car-type-model.component.html',
  styleUrls: ['./rent-car-type-model.component.scss']
})
export class RentCarTypeModelComponent implements OnInit {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  carRentTypeForm: UntypedFormGroup;
  addbrandModelForm: UntypedFormGroup;
  updatebrandModelForm: UntypedFormGroup;
  addNewModel: boolean = false;
  isCollapsed: boolean = false;
  brand_modal_list: any[] = [];
  type_details: any;
  selected_country: any;
  currencysign: any;

  @Output() rent_car_type_event = new EventEmitter<any>();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.code === 'Escape') {
      this.modalRef?.onHidden.subscribe(() => {
        this.closeModal();
      })
    }
  }

  constructor(public _helper: Helper, private modalService: BsModalService, private _carRentServiceService: CarRentServiceService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.carRentTypeForm = new UntypedFormGroup({
      name: new UntypedFormControl(null, [Validators.required]),
      is_active: new UntypedFormControl(true, Validators.required),
      plateform_fee: new UntypedFormControl(0, [Validators.required, Validators.max(99999)])
    })
  }

  show(details: any, country_detail) {
    this.selected_country = country_detail;
    this.currencysign = country_detail.currencysign;
    if (details) {
      this.type_details = details;
      this.carRentTypeForm.patchValue({
        name: details.name,
        is_active: details.is_active,
        plateform_fee: details.plateform_fee
      })
    }
    this.modalRef = this.modalService.show(this.template, this.config)
    if ((!this._helper.has_permission(this._helper.PERMISSION.EDIT) && !this._helper.has_permission(this._helper.PERMISSION.ADD)) || (this.type_details && !this._helper.has_permission(this._helper.PERMISSION.EDIT)) || (!this.type_details && !this._helper.has_permission(this._helper.PERMISSION.ADD))) {
      this.carRentTypeForm.disable();
    }
  }

  closeModal() {
    this.modalRef?.hide();
    setTimeout(() => {
      this.isCollapsed = false;
      this.addNewModel = false;
      this.type_details = null;
      this.carRentTypeForm.reset();
    }, 200);
  }

  saveRentType() {
    this.carRentTypeForm.patchValue({
      name : this.carRentTypeForm.value.name?.toString().trim()
    })
    if(!this.type_details){
      this.carRentTypeForm.get('is_active')?.disable();
    }
    this.carRentTypeForm.markAllAsTouched();
    if (this.carRentTypeForm.valid) {
      let json: any = {
        name: this.carRentTypeForm.value.name.trim(),
        plateform_fee: this.carRentTypeForm.value.plateform_fee,
        country_id: this.selected_country._id
      };
      if (this.type_details) {
        json['id'] = this.type_details._id;
        json["is_active"] = this.carRentTypeForm.value.is_active;
      } else {
        json["is_active"] = true;
      }
      this._carRentServiceService.addRentCarType(json).then((response) => {
        if (response?.success) {
          this.closeModal();
          this.rent_car_type_event.emit();
        }
      })
    }
  }

}
