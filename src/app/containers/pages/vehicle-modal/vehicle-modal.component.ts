import { Component, EventEmitter, HostListener, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommonService } from 'src/app/services/common.service';
import { CountryService } from 'src/app/services/country.service';
import { ManageVehicleService } from 'src/app/services/manage-vehicle.service';
import { NotifiyService } from 'src/app/services/notifier.service';
import { PartnerService } from 'src/app/services/partner.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { Helper } from 'src/app/shared/helper';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vehicle-modal',
  templateUrl: './vehicle-modal.component.html',
  styleUrls: ['./vehicle-modal.component.scss']
})
export class VehicleModalComponent implements OnInit {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  addVehicle: UntypedFormGroup;
  updateDocument: UntypedFormGroup;
  updateParameters = {};
  listData: any;
  vehicleDetails: any;
  isCollapsed: boolean = false;
  is_edit: boolean = false;
  driver_id: string;
  country_list: any[] = [];
  vehicleType: any[] = [];
  filteredvehicleType: any[] = [];
  vehicleDocument: any[] = [];
  IMAGE_URL = environment.IMAGE_URL;
  todayDate: Date = new Date();
  documentIndex: number;
  isDocumentEdit: boolean = false;
  vehicleDocumentFile: Blob;
  vehicleFormData: FormData;
  is_history: boolean;
  history: any;
  brand_list: any[] = [];
  brand_modal_list: any[] = [];
  filtered_brand_modal_list: any[] = [];
  service_type_name: any;
  currentYear = new Date().getFullYear();

  @Output() vehicle_emit_event = new EventEmitter<any>();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.code === 'Escape') {
      this.modalRef?.onHidden.subscribe(() => {
        this.closeModal();
      })
    }
  }

  constructor(private modalService: BsModalService, public _helper: Helper, private commonService: CommonService, private _countryService: CountryService, private _vehicleService: VehicleService, private _partnerService: PartnerService, private _notifierService: NotifiyService,private _manageVehicleService:ManageVehicleService) { }

  ngOnInit(): void {
    //empty for future implementation
   }

  show(vehicle_details: any, history = false): void {
    this.is_history = history;
    this.vehicleDetails = vehicle_details;
    if (this.is_history) {
      this.getVehicleHistory();
      this.modalRef = this.modalService.show(this.template, this.config);
    } else {
      this._initForm();
      if (vehicle_details) {
        this.service_type_name = vehicle_details.type_detail?.typename;
        this.patchForm();
        this.getDocumentList();
      }
      this._vehicleService.fetch_vehicle_admin_types().then((res: any) => {
        this.vehicleType = res.types;
        this.getCountryList();
        this.getVehicleBrand();
      })
      this.modalRef = this.modalService.show(this.template, this.config);
    }

    if (!this._helper.has_permission(this._helper.PERMISSION.EDIT)) {
      this.addVehicle.disable();
      this.updateDocument.disable();
    }
  }

  closeModal() {
    this.modalRef?.hide();
    this.isDocumentEdit = false;
    this.brand_list = [];
    this.brand_modal_list = [];
    this.filtered_brand_modal_list = [];
  }

  // vehicle passing year
  yearsValidation(control: AbstractControl): any {
    let date = new Date()
    if (control.value > date.getFullYear()) {
      return { yearInvalid: true }
    }
    return null
  }

  _initForm() {
    this.addVehicle = new UntypedFormGroup({
      country_id: new UntypedFormControl(null, [Validators.required]),
      vehicle_type: new UntypedFormControl(null, [Validators.required]),
      name: new UntypedFormControl(null, [Validators.required]),
      brand_id: new UntypedFormControl(null, [Validators.required]),
      plate_no: new UntypedFormControl(null, [Validators.required]),
      modal: new UntypedFormControl(null, [Validators.required]),
      model_id: new UntypedFormControl(null, [Validators.required]),
      year: new UntypedFormControl(null, [Validators.required, this.yearsValidation]),
      color: new UntypedFormControl(null, [Validators.required]),
      service_type: new UntypedFormControl('', [Validators.required]),
      accessibility: new UntypedFormControl(''),
    })
    this.updateDocument = new UntypedFormGroup({
      expired_date: new UntypedFormControl(''),
      unique_code: new UntypedFormControl('')
    })
  }

  async patchForm() {
    this.addVehicle.patchValue({
      country_id: this.vehicleDetails.country_id,
      vehicle_type: this.vehicleDetails.vehicle_type,
      name: this.vehicleDetails.name,
      brand_id: this.vehicleDetails.brand_id,
      plate_no: this.vehicleDetails.plate_no,
      year: this.vehicleDetails.passing_year,
      color: this.vehicleDetails.color,
      accessibility: this.vehicleDetails.accessibility,
    })

    let json: any = { type: this._helper.BRAND.BRAND_MODEL, brand_id: this.vehicleDetails.brand_id }
    this._manageVehicleService.getVehicleBrandModel(json).then((response) => {
      this.brand_modal_list = response.list;
      this.filterBrandModalList();
      let brand_modal = this.brand_modal_list.filter(brand_model => brand_model._id == this.vehicleDetails.model_id)
      this.addVehicle.patchValue({
        model_id: brand_modal[0]?._id,
        modal: brand_modal[0]?.name
      })
    })
  }

  //get country list
  getCountryList() {
    this._countryService.fetchCountry().then(res => {
      this.country_list = res.country_list;
      if (this.vehicleDetails) {
        this.filterVehicleTypeList(this.vehicleDetails.vehicle_type);
        let vehicle_type = this.vehicleType.filter(type => type._id == this.vehicleDetails.admin_type_id);
        this.addVehicle.patchValue({
          service_type: vehicle_type[0]?._id,
        })
      }
    })
  }

  // service type list
  getServiceTypeList() {
    this._vehicleService.fetch_vehicle_admin_types().then((res: any) => {
      this.vehicleType = res.types;
    })
  }

  // save vehicle data
  saveVehicle() {
    this.addVehicle.patchValue({
      plate_no: this.addVehicle.value.plate_no?.toString().trim(),
      color: this.addVehicle.value.color?.toString().trim()
    })
    if (this.addVehicle.invalid) {
      return this.addVehicle.markAllAsTouched()
    }
    let formData = new FormData()

    formData.set('country_id', this.addVehicle.value.country_id)
    formData.set('vehicle_type', this.addVehicle.value.vehicle_type)
    formData.set('name', this.addVehicle.value.name)
    formData.set('brand_id', this.addVehicle.value.brand_id)
    formData.set('plate_no', this.addVehicle.value.plate_no)
    formData.set('model', this.addVehicle.value.modal)
    formData.set('model_id', this.addVehicle.value.model_id)
    formData.set('color', this.addVehicle.value.color)
    formData.set('passing_year', this.addVehicle.value.year)
    formData.set('admin_type_id', this.addVehicle.value.service_type)
    if (this.addVehicle.value.accessibility) {
      let sorted = this.addVehicle.value.accessibility.sort()
      for (const sort of sorted) {
        formData.append('accessibility[]', sort)
      }
    }
    formData.set('type', this._helper.TRIP_STATUS_TYPE_VALUE.ADMIN.toString())
    if (this.vehicleDetails) {
      formData.set('vehicle_id', this.vehicleDetails._id)
      this._partnerService.partnerVehicleUpdate(formData).then((res: any) => {
        if (res.success) {
          this.modalRef.hide();
          this.vehicle_emit_event.emit();
          setTimeout(() => {
            this.addVehicle.reset();
          }, 500);
        }
      })
    } else {
      this._vehicleService.add_admin_vehicle(formData).then((res: any) => {
        if (res.success) {
          this.modalRef.hide();
          this.vehicle_emit_event.emit();
          setTimeout(() => {
            this.addVehicle.reset();
          }, 500);
        }
      })
    }
  }

  changeVehicleType(vehicle_type) {
    this.addVehicle.patchValue({
      service_type: '',
      modal: '',
      modal_id: '',
    })
    this.filterVehicleTypeList(vehicle_type);
  }

  filterVehicleTypeList(vehicle_type) {
    if (vehicle_type == this._helper.VEHICLE_TYPE.EV) {
      this.filteredvehicleType = this.vehicleType.filter(vehicle => vehicle.vehicle_type == this._helper.VEHICLE_TYPE.EV);
    } else {
      this.filteredvehicleType = this.vehicleType.filter(vehicle => vehicle.vehicle_type == this._helper.VEHICLE_TYPE.NORMAL);
    }
    this.filterBrandModalList();
  }

  getDocumentList() {
    let json: any = { _id: this.vehicleDetails._id, vehicle_id: this.vehicleDetails._id }
    this._partnerService.fetchDocumentList(json).then((response) => {
      if (response.success) {
        this.vehicleDocument = response.provide_vehicle_document;
        response.provide_vehicle_document.forEach(document => {
          document.document_picture = this.IMAGE_URL + document.document_picture;
          if (document.document_picture.split(".").pop() != 'pdf') {
            let tester = new Image();
            tester.onload = imageFound;
            tester.onerror = imageNotFound;
            tester.src = document.document_picture;
            function imageFound() {
              document.is_download = true;
            }
            function imageNotFound() {
              document.is_download = false;
            }
          } else {
            document.is_download = true;
          }
        })
      } else {
        this.vehicleDocument = [];
      }
    })
  }

  onSelectImageFile(event) {
    let files = event.target.files;
    if (files.length === 0) return;
    const mimeType = files[0].type;
    if (mimeType.includes('pdf') && files[0].size > this._helper.PDFSIZE) {
      this._notifierService.showNotification('error', this._helper.trans.instant('validation-title.document-size'));
      return;
    }
    let fileType = this._helper.uploadDocFile.filter((element) => {
      return mimeType == element;
    })
    if (mimeType != fileType) {
      this._notifierService.showNotification('error', this._helper.trans.instant('validation-title.invalid-document-format'));
    } else {
      this.vehicleDocumentFile = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(this.vehicleDocumentFile);

      if (mimeType != 'application/pdf') {
        reader.onload = (_event) => {
          this.vehicleDocument[this.documentIndex].document_picture = reader.result;
        }
      } else {
        reader.onload = (_event) => {
          this.vehicleDocument[this.documentIndex].document_picture = this._helper.DEFAULT_IMAGE.DEFAULT_PDF_IMG
        }
      }
    }
  }

  // vehicle document data fetch
  onVehicelDocumentEdit(document, i) {
    this.documentIndex = i;
    this.isDocumentEdit = true;
    document.isDocumentEdit = true
    if (this.isDocumentEdit) {
      this.updateDocument.patchValue({
        expired_date: document.expired_date,
        unique_code: document.unique_code,
      })
    }
  }

  // vehicle document update
  onVehicelDocumentUpdate(document, formValue, vehicle) {
    document.is_update_clicked = true;
    if ((document.is_expired_date && !this.updateDocument.value.expired_date) || (document.is_unique_code && !this.updateDocument.value.unique_code)) {
      return
    }

    if (document.option == 1 && document.document_picture == this.IMAGE_URL) {
      this._notifierService.showNotification('error', this._helper.trans.instant('validation-title.please_upload_image'));
      return;
    }
    if (document.option != 1 && !document.is_expired_date && !document.is_unique_code && document.document_picture == this.IMAGE_URL) {
      if (!this.vehicleDocumentFile) {
        this._notifierService.showNotification('error', this._helper.trans.instant('validation-title.please_upload_image'));
        return;
      }
    }
    this.vehicleFormData = new FormData;
    this.vehicleFormData.append('_id', document._id);
    this.vehicleFormData.append('type', '7');
    this.vehicleFormData.append('expired_date', formValue.expired_date || '');
    this.vehicleFormData.append('unique_code', formValue.unique_code || '');
    if (this.vehicleDocumentFile) {
      this.vehicleFormData.append('document_picture', this.vehicleDocumentFile || '')
    }
    this._partnerService.updateDocument(this.vehicleFormData).then((res_data: any) => {
      if (res_data.success) {
        this.vehicleDocumentFile = null;
        this.isDocumentEdit = false;
        document.isDocumentEdit = false;
        this.getDocumentList();
      }
    })
  }

  // download document image
  onDownload(image_url, docname) {
    this._helper.downloadUrl(image_url).subscribe(imgData => {
      this._helper.downloadImage(imgData, docname)
    });
  }

  getVehicleHistory() {
    let json: any = { vehicle_id: this.vehicleDetails._id }
    this._manageVehicleService.getVehicleHistory(json).then((response) => {
      if (response.success) {
        this.history = response.history[0];

        this.history.logs = this.history.logs.filter((log) => {
          return (
            log.type == this._helper.VEHICLE_HISTORY_TYPE.ADDED ||
            log.type == this._helper.VEHICLE_HISTORY_TYPE.UPDATED ||
            log.type == this._helper.VEHICLE_HISTORY_TYPE.ASSIGNED ||
            log.type == this._helper.VEHICLE_HISTORY_TYPE.UNASSIGNED
          );
        })
      }
    })
  }

  getVehicleBrand() {
    let json: any = { type: this._helper.BRAND.BRAND }
    this._manageVehicleService.getVehicleBrandModel(json).then((response) => {
      this.brand_list = response.list;
    })
  }

  onCHangeBrandName(brand_id) {
    this.addVehicle.patchValue({
      modal: '',
      modal_id: '',
    })
    let brand = this.brand_list.filter(brand => brand._id == brand_id);
    this.getVehicleBrandModel(brand[0]);
  }

  getVehicleBrandModel(brand) {
    this.addVehicle.patchValue({
      brand_id: brand._id,
      name: brand.name
    })
    let json: any = { type: this._helper.BRAND.BRAND_MODEL, brand_id: brand._id }
    this._manageVehicleService.getVehicleBrandModel(json).then((response) => {
      this.brand_modal_list = response.list;
      this.filterBrandModalList();
    })
  }

  filterBrandModalList() {
    if ((this.addVehicle.value.vehicle_type || this.addVehicle.value.vehicle_type == 0) && this.brand_modal_list.length > 0) {
      this.filtered_brand_modal_list = this.brand_modal_list.filter(brand_modal => brand_modal.vehicle_type == this.addVehicle.value.vehicle_type);
    } else {
      this.filtered_brand_modal_list = [];
    }
  }

  onChangeBrandModal(model_id) {
    let brand_modal = this.brand_modal_list.filter(brand_model => brand_model._id == model_id)
    this.addVehicle.patchValue({
      model_id: brand_modal[0]?._id,
      modal: brand_modal[0]?.name
    })
  }

}
