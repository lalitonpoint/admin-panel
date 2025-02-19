import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CarRentServiceService } from 'src/app/services/car-rent-service.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-rent-car-specification-model',
  templateUrl: './rent-car-specification-model.component.html',
  styleUrls: ['./rent-car-specification-model.component.scss']
})
export class RentCarSpecificationModelComponent implements OnInit {

  modalRef: BsModalRef;
  specificationForm: UntypedFormGroup;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  is_edit: boolean = false;
  form_data: FormData;
  addOption: boolean = false;
  errorOption: boolean = false;
  specificationOptions:any = [];
  option: string = '';

  @Output() specificationHandler: EventEmitter<any> = new EventEmitter();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  constructor(private modalService: BsModalService, public helper: Helper, private _carRentServiceService: CarRentServiceService ) { }

  ngOnInit(): void {
    this._initForm();
  }

  _initForm() {
    this.specificationForm = new UntypedFormGroup({
      title: new UntypedFormControl(null, [Validators.required]),
      is_active: new UntypedFormControl(null, [Validators.required]),
      newOption: new UntypedFormControl(null)  // Add newOption control
    });
  }

  show(data): void {
    this.form_data = new FormData();
    this._initForm();
    if (data) {
      this.is_edit = true
      this.specificationForm.patchValue({ title: data.title, is_active: data.is_active});
      for (let option of data.options) {
        this.specificationOptions.push(option)
      }
      this.form_data.set('id', data._id);
    } else {
      this.specificationForm.patchValue({is_active: true});
      this.specificationForm.controls.is_active.disable();
    }
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  onSave() {
    this.specificationForm.patchValue({
      title : this.specificationForm.value.title?.toString().trim()
    });
    if(this.specificationForm.invalid){
      this.specificationForm.markAllAsTouched();
      return;
    }
    this.form_data.set('title', this.specificationForm.getRawValue().title);
    if (this.specificationForm.getRawValue().is_active || this.specificationForm.getRawValue().is_active == 1) {
      this.form_data.set('is_active', 'true');
    } else {
      this.form_data.set('is_active', 'false');
    }
    this.form_data.set('options', this.specificationOptions);
    this._carRentServiceService.addEditRentCarSpecification(this.form_data).then(response => {
      if (response) {
        this.specificationHandler.emit();
        this.onClose()
      }
    });
  }

  addNewOption() {
    this.addOption = true;
    this.specificationForm.get('newOption').reset();
  }

  // save option 
  saveOption() {

    const newOption = this.specificationForm.get('newOption').value;

    this.errorOption = this.specificationOptions.some(option =>
      option.trim().toLowerCase() === newOption.trim().toLowerCase()
    );

    if(this.errorOption){
      return; 
    }
    
    if (newOption) {
      this.specificationOptions.push(newOption);  // Push the new option to specificationOptions
    }
    this.addOption = false;
  }

  onRemove(option_index) {
    this.specificationOptions.splice(option_index, 1);
  }

  onMultipler() {
    const newOption = this.specificationForm.get('newOption').value;
    this.errorOption = this.specificationOptions.some(option =>
      option.trim().toLowerCase() === newOption.trim().toLowerCase()
    );
  }

  onClose() {
    this.modalRef.hide()
    setTimeout(() => {
      this.form_data = new FormData();
      this.specificationForm.reset();
      this.is_edit = false;
      this.addOption = false;
      this.specificationOptions = [];
      this.errorOption = false;
    }, 100);
  }
}
