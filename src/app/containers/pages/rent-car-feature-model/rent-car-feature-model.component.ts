import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CarRentServiceService } from 'src/app/services/car-rent-service.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-rent-car-feature-model',
  templateUrl: './rent-car-feature-model.component.html',
  styleUrls: ['./rent-car-feature-model.component.scss']
})
export class RentCarFeatureModelComponent implements OnInit {

  modalRef: BsModalRef;
  featureForm: UntypedFormGroup;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  is_edit: boolean = false;
  form_data: FormData;

  @Output() featureHandler: EventEmitter<any> = new EventEmitter();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  constructor( private modalService: BsModalService, public helper: Helper, private _carRentServiceService: CarRentServiceService ) { }

  ngOnInit(): void {
    this._initForm();
  }

  _initForm() {
    this.featureForm = new UntypedFormGroup({
      title: new UntypedFormControl(null, [Validators.required]),
      is_active: new UntypedFormControl(null, [Validators.required])
    });
  }

  show(data): void {
    this.form_data = new FormData();
    this._initForm();
    if (data) {
      this.is_edit = true
      this.featureForm.patchValue({ title: data.title, is_active: data.is_active});
      this.form_data.set('id', data._id)
    } else {
      this.featureForm.patchValue({is_active: true});
      this.featureForm.controls.is_active.disable();
    }
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  onSave() {
    this.featureForm.patchValue({
      title : this.featureForm.value.title?.toString().trim()
    })
    if(this.featureForm.invalid){
      this.featureForm.markAllAsTouched();
      return;
    }
    this.form_data.set('title', this.featureForm.getRawValue().title);
    if (this.featureForm.getRawValue().is_active || this.featureForm.getRawValue().is_active == 1) {
      this.form_data.set('is_active', 'true');
    } else {
      this.form_data.set('is_active', 'false');
    }
    this._carRentServiceService.addEditRentCarFeature(this.form_data).then(response => {
      if (response) {
        this.featureHandler.emit();
        this.onClose()
      }
    });
  }

  onClose() {
    this.modalRef.hide()
    setTimeout(() => {
      this.form_data = new FormData();
      this.featureForm.reset();
      this.is_edit = false;
    }, 100);
  }

}


