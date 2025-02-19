import { Component, EventEmitter, HostListener, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { DEFAULT_IMAGE, VEHICLE_RATIO } from 'src/app/constants/constants';
import { environment } from 'src/environments/environment';
import { ServiceTypeService } from 'src/app/services/service-type.service';
import { ImageCropModelComponent } from '../image-crop-model/image-crop-model.component';
import { NotifiyService } from 'src/app/services/notifier.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-service-type-modal',
  templateUrl: './service-type-modal.component.html',
  styleUrls: ['./service-type-modal.component.scss']
})
export class ServiceTypeModalComponent implements OnInit {
  IMAGE_URL = environment.IMAGE_URL;
  DEFAULT_TAXI_IMAGE = DEFAULT_IMAGE.DEFAULT_TAXI_IMAGE;
  modalRef: BsModalRef;
  typeFrom: UntypedFormGroup;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  typeListData: any
  vehicle_imagefile: Blob;
  mappin_imagefile: Blob;
  upload_vehicle_imageurl: any = '';
  upload_mappin_imageurl: any = '';
  is_edit: boolean = false;
  image_type: number = 1;
  image_settings: any;
  form_data: FormData;
  show_default_selected_error:boolean = false;

  @Output() vehicleHandler: EventEmitter<any> = new EventEmitter();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  @ViewChild('cropModel', { static: true }) cropModel: ImageCropModelComponent;

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.code === 'Escape') {
      this.modalRef?.onHidden.subscribe(() => {
        this.onClose();
      })
    }
  }

  constructor(private modalService: BsModalService, private serviceType: ServiceTypeService, private _notifierService: NotifiyService, public helper: Helper, private _notifiyService: NotifiyService) { }

  ngOnInit(): void {
    this._initForm();
  }

  _initForm() {
    this.typeFrom = new UntypedFormGroup({
      vehicle_type: new UntypedFormControl(this.helper.VEHICLE_TYPE.NORMAL, [Validators.required]),
      service_type_name: new UntypedFormControl(null, [Validators.required]),
      business_type: new UntypedFormControl(1),
      defaultSelect: new UntypedFormControl(false)
    });
  }

  show(typeData): void {
    this.form_data = new FormData();
    this._initForm();
    if (typeData) {
      this.is_edit = true
      this.typeFrom.patchValue({ service_type_name: typeData.typename, business_type: typeData.is_business, defaultSelect: typeData.is_default_selected,vehicle_type:typeData.vehicle_type });
      if(typeData.is_default_selected){
        this.typeFrom.controls.defaultSelect.disable();
        this.typeFrom.controls.business_type.disable();
        this.typeFrom.patchValue({service_type_name: typeData.typename,vehicle_type:typeData.vehicle_type, business_type: 1, defaultSelect: true})
        this.show_default_selected_error = true;
      } else {
        this.show_default_selected_error = false;
        this.typeFrom.controls.defaultSelect.enable();
        this.typeFrom.controls.business_type.enable();
        if (typeData.is_business == 0 || !typeData.is_business) { 
          this.typeFrom.controls.defaultSelect.disable();
          this.typeFrom.patchValue({defaultSelect:false})
        } else {
          this.typeFrom.controls.defaultSelect.enable();
        }
      }
      this.vehicle_imagefile = typeData.type_image_url;
      this.mappin_imagefile = typeData.map_pin_image_url;
      this.form_data.set('id', typeData._id)
      if (typeData.type_image_url !== '') { this.upload_vehicle_imageurl = this.IMAGE_URL + typeData.type_image_url }
      if (typeData.map_pin_image_url !== '') { this.upload_mappin_imageurl = this.IMAGE_URL + typeData.map_pin_image_url }
    }
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  service_Type() {
    this.typeFrom.patchValue({
      service_type_name : this.typeFrom.value.service_type_name?.toString().trim()
    })
    if (this.is_edit) {
      if(this.typeFrom.invalid){
        this.typeFrom.markAllAsTouched();
        return;
      }
      if (!this.vehicle_imagefile || !this.mappin_imagefile) {
        this._notifierService.showNotification('error', this.helper.trans.instant('validation-title.please_upload_all_image_files'));
        return
      }
      this.form_data.set('typename', this.typeFrom.getRawValue().service_type_name);
      this.form_data.set('vehicle_type', this.typeFrom.value.vehicle_type);
      if (this.typeFrom.getRawValue().business_type || this.typeFrom.getRawValue().business_type == 1) {
        this.form_data.set('is_business', '1');
      } else {
        this.form_data.set('is_business', '0');
      }
      this.form_data.set('is_default_selected', this.typeFrom.getRawValue().defaultSelect);
      this.serviceType.editServiceType(this.form_data).then(response => {
        if (response) {
          this.vehicleHandler.emit();
          this.onClose()
        }
      });
    } else {
      if(this.typeFrom.invalid){
        this.typeFrom.markAllAsTouched();
        return;
      }
      if (!this.vehicle_imagefile || !this.mappin_imagefile) {
        this._notifierService.showNotification('error', this.helper.trans.instant('validation-title.please_upload_all_image_files'));
        return
      }
      this.form_data.set('typename', this.typeFrom.value.service_type_name);
      this.form_data.set('vehicle_type', this.typeFrom.value.vehicle_type);
      if (this.typeFrom.value.business_type || this.typeFrom.value.business_type == 1) {
        this.form_data.set('is_business', '1');
      } else {
        this.form_data.set('is_business', '0');
      }
      this.form_data.set('is_default_selected', this.typeFrom.value.defaultSelect);
      this.serviceType.addServiceType(this.form_data).then(response => {
        if (response) {
          this.vehicleHandler.emit();
          this.onClose()
        }
      });
    }
  }

  // imagefile:Blob;
  onSelectImageFile(event, type) {  //type //1: Vehicle, 2: Map-pin
    this.image_type = type
    let files = event.target.files;
    if (files.length === 0)
      return;
    const mimeType = files[0].type;
    let fileType = this.helper.uploadFile.filter((element) => {
      return mimeType == element;
    })
    if (mimeType != fileType) {
      this._notifierService.showNotification('error', this.helper.trans.instant('validation-title.invalid-image-format'))
      return;
    }
    let aspectRatio:any;
    let resizeToWidth:any;
    if (this.image_type === 1) {
      aspectRatio = VEHICLE_RATIO.vehicle_image_ratio;  // vehicle_image_ratio
      resizeToWidth = VEHICLE_RATIO.vehicle_image_max_width;  // vehicle_image_max_width
    } else {
      aspectRatio = VEHICLE_RATIO.vehicle_map_pin_ratio;  // vehicle_map_pin_ratio
      resizeToWidth = VEHICLE_RATIO.vehicle_map_pin_max_width;  // vehicle_map_pin_max_width
    }
    this.cropModel.imageChangedEvent = event;
    this.cropModel.show(aspectRatio, resizeToWidth);
  }

  imageCropped(event) {
    const reader = new FileReader();
    reader.readAsDataURL(event);
    if (this.image_type === 1) {
      this.vehicle_imagefile = event;
      this.form_data.set('type_image_url', this.vehicle_imagefile)
      reader.onload = (_event) => {
        this.upload_vehicle_imageurl = reader.result
      }
    } else {
      reader.onload = (_event) => {
        this.mappin_imagefile = event;
        this.form_data.set('map_pin_image_url', this.mappin_imagefile)
        this.upload_mappin_imageurl = reader.result
      }
    }
  }

  onClose() {
    this.modalRef.hide()
    setTimeout(() => {
      this.form_data = new FormData();
      this.typeFrom.reset();
      this.is_edit = false;
      this.upload_vehicle_imageurl = ''
      this.upload_mappin_imageurl = ''
      this.vehicle_imagefile = null;
      this.mappin_imagefile = null;
    }, 100);
  }

  // on change business
  businessChange(event) {
    if(event){
    if (this.typeFrom.value.business_type == 0 || !this.typeFrom.value.business_type) {
      this.typeFrom.controls.defaultSelect.disable();
      this.typeFrom.patchValue({defaultSelect:false})
    } else {
      this.typeFrom.controls.defaultSelect.enable();
    }
    }
  }
}
