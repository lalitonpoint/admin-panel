import { Component, EventEmitter, HostListener, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/services/common.service';
import { ManageVehicleService } from 'src/app/services/manage-vehicle.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-brand-modal',
  templateUrl: './brand-modal.component.html',
  styleUrls: ['./brand-modal.component.scss']
})
export class BrandModalComponent implements OnInit {
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
  brand_details: any;

  @Output() brand_save_event = new EventEmitter<any>();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.code === 'Escape') {
      this.modalRef?.onHidden.subscribe(() => {
        this.closeModal();
      })
    }
  }

  constructor(private modalService: BsModalService, private _commonService: CommonService, public _helper: Helper,private _manageVehicleService:ManageVehicleService) { }

  ngOnInit(): void {
    this.initForm();
  }

  show(details: any) {
    this.brand_details = null;
    this.brand_modal_list = [];
    this.initForm();
    if (details) {
      this.brand_details = details;
      this.brandForm.patchValue({
        name: details.name
      })
      this.getVehicleBrandModel();
    }
    this.modalRef = this.modalService.show(this.template, this.config)
    if((!this._helper.has_permission(this._helper.PERMISSION.EDIT) && !this._helper.has_permission(this._helper.PERMISSION.ADD)) || (this.brand_details && !this._helper.has_permission(this._helper.PERMISSION.EDIT)) || (!this.brand_details && !this._helper.has_permission(this._helper.PERMISSION.ADD))){
      this.brandForm.disable();
    }
    if(!this._helper.has_permission(this._helper.PERMISSION.EDIT)){
      this.updatebrandModelForm.disable();
    }
  }

  initForm() {
    this.brandForm = new UntypedFormGroup({
      name: new UntypedFormControl(null, [Validators.required]),
    })
    this.addbrandModelForm = new UntypedFormGroup({
      name: new UntypedFormControl(null, [Validators.required]),
      vehicle_type: new UntypedFormControl(null, [Validators.required]),
    })
    this.updatebrandModelForm = new UntypedFormGroup({
      name: new UntypedFormControl(null, [Validators.required]),
      vehicle_type: new UntypedFormControl(null, [Validators.required]),
    })
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
    let json: any = { type: this._helper.BRAND.BRAND_MODEL,brand_id:this.brand_details._id }
    this._manageVehicleService.getVehicleBrandModel(json).then((response) => {
      this.brand_modal_list = response.list;
    })
  }

  editModel(model) {
    model.is_edit = !model.is_edit;
    this.isCollapsed = !this.isCollapsed;
    this.updatebrandModelForm.patchValue({
      name: model.name,
      vehicle_type: model.vehicle_type
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
    this.brandForm.markAllAsTouched();
    if (this.brandForm.valid) {
      let json: any = { type: this._helper.BRAND.BRAND, name: this.brandForm.value.name.trim() }
      if (this.brand_details) {
        json['id'] = this.brand_details._id
      }
      this._manageVehicleService.addEditVehicleModelBrand(json).then((response) => {
        if (response.success) {
          this.closeModal();
          this.brand_save_event.emit();
        }
      })
    }
  }

  saveNewBrandModel() {
    this.addbrandModelForm.markAllAsTouched();
    if (this.addbrandModelForm.valid) {
      let json: any = { type: this._helper.BRAND.BRAND_MODEL, brand_id: this.brand_details._id, name: this.addbrandModelForm.value.name.trim(), vehicle_type: this.addbrandModelForm.value.vehicle_type }
      this._manageVehicleService.addEditVehicleModelBrand(json).then((response) => {
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
    this.updatebrandModelForm.markAllAsTouched();
    if (this.updatebrandModelForm.valid) {
      let json: any = { type: this._helper.BRAND.BRAND_MODEL, brand_id: this.brand_details._id, id: model._id, name: this.updatebrandModelForm.value.name.trim(), vehicle_type: this.updatebrandModelForm.value.vehicle_type }
      this._manageVehicleService.addEditVehicleModelBrand(json).then((response) => {
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
