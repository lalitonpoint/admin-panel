import { Component, EventEmitter, HostListener, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CarRentServiceService } from 'src/app/services/car-rent-service.service';
import { CommonService } from 'src/app/services/common.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-rent-car-brand-model',
  templateUrl: './rent-car-brand-model.component.html',
  styleUrls: ['./rent-car-brand-model.component.scss']
})
export class RentCarBrandModelComponent implements OnInit {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  brandForm: UntypedFormGroup;
  addbrandModelForm: UntypedFormGroup;
  updatebrandModelForm: UntypedFormGroup;
  addNewModel: boolean = false;
  isCollapsed: boolean = false;
  brand_modal_list: any[] = [];
  type_list: any[] = [];
  brand_details: any;
  country_details: any;

  @Output() rent_car_brand_model_event = new EventEmitter<any>();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.code === 'Escape') {
      this.modalRef?.onHidden.subscribe(() => {
        this.closeModal();
      })
    }
  }

  constructor(private modalService: BsModalService, private _commonService: CommonService, public _helper: Helper, private _carRentServiceService: CarRentServiceService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.brandForm = new UntypedFormGroup({
      name: new UntypedFormControl(null, [Validators.required]),
    })
    this.addbrandModelForm = new UntypedFormGroup({
      name: new UntypedFormControl(null, [Validators.required]),
      car_type_id: new UntypedFormControl(null, [Validators.required])
    })
    this.updatebrandModelForm = new UntypedFormGroup({
      name: new UntypedFormControl(null, [Validators.required]),
      car_type_id: new UntypedFormControl(null, [Validators.required])
    })
  }

  show(details: any, country_detail) {
    this.brand_details = null;
    this.brand_modal_list = [];
    this.country_details = country_detail;
    this.initForm();
    if (details) {
      this.brand_details = details;
      this.brandForm.patchValue({
        name: details.name
      })
      this.getVehicleBrandModel();
      this.getVehicleType();
    }
    this.modalRef = this.modalService.show(this.template, this.config)
    if((!this._helper.has_permission(this._helper.PERMISSION.EDIT) && !this._helper.has_permission(this._helper.PERMISSION.ADD)) || (this.brand_details && !this._helper.has_permission(this._helper.PERMISSION.EDIT)) || (!this.brand_details && !this._helper.has_permission(this._helper.PERMISSION.ADD))){
      this.brandForm.disable();
    }
    if(!this._helper.has_permission(this._helper.PERMISSION.EDIT)){
      this.updatebrandModelForm.disable();
    }
  }

  //add new model
  newModel(add) {
    if (add == 'add') {
      this.addNewModel = true;
    } else {
      this.addNewModel = false;
      setTimeout(() => {
        this.addbrandModelForm.reset();
      }, 500);
    }
  }

  getVehicleBrandModel() {
    let json: any = { type: this._helper.BRAND.BRAND_MODEL, brand_id:this.brand_details._id }
    this._carRentServiceService.getRentCarTypeBrandModel(json).then((response) => {
      this.brand_modal_list = response.list;
    })
  }

  getVehicleType() {
    let json = {
      country_id: this.country_details._id
    }
    this._carRentServiceService.getRentCarTypeList(json).then(res => {
      if (res.success) {
        this.type_list = res.car_rent_type_list;
      }
    })
  }

  editModel(model) {
    model.is_edit = !model.is_edit;
    this.isCollapsed = !this.isCollapsed;
    this.updatebrandModelForm.patchValue({
      name: model.name,
      car_type_id: model.type_id
    })
  }


  closeModal() {
    this.modalRef?.hide();
    setTimeout(() => {
      this.isCollapsed = false;
      this.addNewModel = false;
      this.brandForm.reset();
      this.addbrandModelForm.reset();
      this.updatebrandModelForm.reset();
    }, 200);
  }

  saveBrand() {
    this.brandForm.patchValue({
      name : this.brandForm.value.name?.toString().trim()
    })
    this.brandForm.markAllAsTouched();
    if (this.brandForm.valid) {
      let json: any = { type: this._helper.BRAND.BRAND, name: this.brandForm.value.name.trim(), country_id: this.country_details._id }
      if (this.brand_details) {
        json['id'] = this.brand_details._id
      }
      this._carRentServiceService.addEditRentCarModelBrand(json).then((response) => {
        if (response.success) {
          this.closeModal();
          this.rent_car_brand_model_event.emit();
        }
      })
    }
  }

  saveNewBrandModel() {
    this.addbrandModelForm.patchValue({
      name : this.addbrandModelForm.value.name?.toString().trim()
    })
    this.addbrandModelForm.markAllAsTouched();
    if (this.addbrandModelForm.valid) {
      let json: any = { type: this._helper.BRAND.BRAND_MODEL, brand_id: this.brand_details._id, name: this.addbrandModelForm.value.name.trim(), type_id: this.addbrandModelForm.value.car_type_id }
      this._carRentServiceService.addEditRentCarModelBrand(json).then((response) => {
        if (response.success) {
          this.addbrandModelForm.reset();
          this.addNewModel = false;
          this.isCollapsed = false;
          this.getVehicleBrandModel();
        }
      })
    }
  }

  updateBrandModel(model) {
    this.updatebrandModelForm.patchValue({
      name : this.updatebrandModelForm.value.name?.toString().trim()
    })
    this.updatebrandModelForm.markAllAsTouched();
    if (this.updatebrandModelForm.valid) {
      let json: any = { type: this._helper.BRAND.BRAND_MODEL, brand_id: this.brand_details._id, id: model._id, name: this.updatebrandModelForm.value.name.trim() }
      this._carRentServiceService.addEditRentCarModelBrand(json).then((response) => {
        if (response.success) {
          this.updatebrandModelForm.reset();
          model.is_edit = false;
          this.isCollapsed = false;
          this.getVehicleBrandModel();
        }
      })
    }
  }

}
