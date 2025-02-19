import { ToastrService } from 'ngx-toastr';
import { ServiceTypeService } from '../../../services/service-type.service';
import { PartnerService } from '../../../services/partner.service';
import { Helper } from 'src/app/shared/helper';
import { CommonService } from 'src/app/services/common.service';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, AbstractControl } from '@angular/forms';
import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DEFAULT_IMAGE, EXPORT_HISTORY_REQUEST_TYPE, PANEL_NAME, PANEL_TYPE ,PDFSIZE } from 'src/app/constants/constants';
import { environment } from 'src/environments/environment';
import { NotifiyService } from 'src/app/services/notifier.service';
import { Subscription } from 'rxjs';
import * as $ from "jquery";

declare const google: any;

@Component({
  selector: 'app-partner-modal',
  templateUrl: './partner-modal.component.html',
  styleUrls: ['./partner-modal.component.scss']
})
export class PartnerModalComponent implements OnInit {
  modalRef: BsModalRef;
  confirmModelRef: BsModalRef;
  addWalletModelRef: BsModalRef;
  accessibilityList = [
    { label: 'label-title.babyseat', value: 'babyseat' },
    { label: 'label-title.hotspot', value: 'hotspot' },
    { label: 'label-title.handicap', value: 'handicap' },
  ];
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  confirmationModalConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  PANEL_TYPE = PANEL_TYPE ;
  PANEL_NAME = PANEL_NAME ;
  EXPORT_HISTORY_REQUEST_TYPE = EXPORT_HISTORY_REQUEST_TYPE;
  data: any;
  IMAGE_URL = environment.IMAGE_URL;
  partnerSettingForm: UntypedFormGroup;
  partnerVehicleForm: UntypedFormGroup;
  updateDocument: UntypedFormGroup;
  vehicle_document_form_data: FormData;
  vehicleFormData: FormData;
  DEFAULT_IMAGE = DEFAULT_IMAGE.USER_PROFILE;
  profile_image: any = this.DEFAULT_IMAGE;
  updateParameters = {};
  deleteById = {};
  walletDetail = {};
  tab: number = 1;
  upload_provider_image: any = '';
  idProof: any = '';
  document_image: any = '';
  document_display_image: any = '';
  provider_document_form_data: any;
  provider_form_data: any;
  vehicleDetails: any;
  listData: any;
  requestList: any;
  vehicleDocument: any;
  selected_document: any;
  partnerStatus: boolean;
  image_settings: any;
  userObservable: Subscription;
  vehicleType: any;
  form_data: FormData;
  partner_id: string;
  type: string | Blob;
  imagefile: Blob;
  documentfile: Blob;
  vehicleDocumentFile: Blob;
  minDate: Date = new Date();
  max_number = 9999;
  wallet_amount: number = 0;
  documentIndex: number;
  imageType: number;
  isError: boolean = false
  isCollapsedAnimated = true;
  is_edit: boolean = false;
  isDocumentEdit = false;
  isAssign: boolean = false;
  isCollapsed: boolean = false;
  babyseat: boolean = false
  handicap: boolean = false
  hotspot: boolean = false
  is_show_phone : boolean;
  is_show_email : boolean;
  timezone_for_display_date:string = '';
  location :any[] = [];
  autocomplete_address:any = '';
  serviceTypeId: any;
  first_name_error: boolean = false;
  last_name_error: boolean = false;

  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  @ViewChild('confirmationTemplate', { static: true }) confirmationTemplate: TemplateRef<any>;
  @ViewChild('addWalletModelTemplate', { static: true }) addWalletModelTemplate: TemplateRef<any>;

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.code === 'Escape') {
      this.modalRef?.onHidden.subscribe(() => {
        this.close();
      })
    }
  }

  constructor(private modalService: BsModalService, private _fb: UntypedFormBuilder, private commonService: CommonService, public _helper: Helper, private partnerService: PartnerService, private serviceType: ServiceTypeService , private toaster : ToastrService,private _notifierService:NotifiyService ) { }

  ngOnInit(): void {
    this._helper.display_date_timezone.subscribe(data => {
      this.timezone_for_display_date = data;
    })
  }

  show(id, type, status): void {
    this.first_name_error = false;
    this.last_name_error = false;
    this._initForm();
    if (id != '') {
      this.updateParameters['_id'] = id;
      this.updateParameters['type'] = type;
      this.partner_id = id;
      this.type = type;
      this.partnerStatus = status;

      this.commonService.fetchUpdateData(this.updateParameters).then((res_data: any) => {
        if(!res_data.is_show_email){
          this.partnerSettingForm.get('email').disable()
        }
        if(!res_data.is_show_phone){
          this.partnerSettingForm.get('country_phone_code').disable()
          this.partnerSettingForm.get('phone').disable()
        }
        if(res_data.success){
          this.modalRef = this.modalService.show(this.template, this.config);
          this.requestList = res_data;
          this.listData = res_data.type_detail[0];
          this.upload_provider_image = this._helper.image_url + res_data.type_detail[0].picture;
          this.idProof = this._helper.image_url + res_data.type_detail[0].government_id_proof;
          this.tab = 1 ;
          this.vehicleDetails = this.listData.vehicle_detail;
          this._patchForm();
          this._initAutocomplete();
        }
      })
    }
    if(!this._helper.has_permission(this._helper.PERMISSION.EDIT)){
      this.partnerSettingForm.disable();
      this.partnerVehicleForm.disable();
    }
  }

  _initForm() {
    this.partnerSettingForm = this._fb.group({
      first_name: new UntypedFormControl('', [Validators.required]),
      last_name: new UntypedFormControl('', [Validators.required]),
      phone: new UntypedFormControl('', [Validators.required, Validators.minLength(this._helper.admin_setting_details?.minimum_phone_number_length ? this._helper.admin_setting_details.minimum_phone_number_length : 8) , Validators.maxLength(this._helper.admin_setting_details?.maximum_phone_number_length ? this._helper.admin_setting_details.maximum_phone_number_length : 12) ]),
      email: new UntypedFormControl(''),
      password: new UntypedFormControl(null, [ Validators.minLength(6)]),
      country: new UntypedFormControl(''),
      companyname: new UntypedFormControl(''),
      country_phone_code: new UntypedFormControl(''),
      address: new UntypedFormControl('')
    });
      this.partnerVehicleForm = this._fb.group({
        name: new UntypedFormControl('', [Validators.required]),
        plate_no: new UntypedFormControl('', [Validators.required]),
        model: new UntypedFormControl('', [Validators.required]),
        color: new UntypedFormControl('', [Validators.required]),
        passing_year: new UntypedFormControl(''),
        service_type: new UntypedFormControl('',[Validators.required]),
        accessibility: new UntypedFormControl(''),
        isAssign: new UntypedFormControl('')
      })
    this.updateDocument = this._fb.group({
      expired_date: new UntypedFormControl(''),
      unique_code: new UntypedFormControl('')
    })
    this.partnerSettingForm.get('address').valueChanges.subscribe((value) => {
      if(value == ''){
        this.autocomplete_address = '';
      }
    });
  }

  _patchForm() {
    this.partnerSettingForm.patchValue({
      first_name: this.listData.first_name,
      last_name: this.listData.last_name,
      phone: this.listData.phone,
      email: this.listData.email,
      country: this.listData.country,
      country_phone_code: this.listData.country_phone_code,
      companyname: this.listData.partner_company_name,
      address: this.listData.address
    })
    this.location = [1,1];
  }

  updatePartner() {
    if(this.first_name_error || this.last_name_error){
      if (this.first_name_error) {
        document.getElementById('first_name')?.focus();
      } else if (!this.first_name_error && this.last_name_error) {
        document.getElementById('last_name')?.focus();
      }
      return;
    }
    if(!this.location[0]){
      this.partnerSettingForm.patchValue({
        address : ''
      })
    }
    this.partnerSettingForm.patchValue({
      first_name: this.partnerSettingForm.value.first_name?.toString().trim(),
      last_name: this.partnerSettingForm.value.last_name?.toString().trim(),
      email: this.partnerSettingForm.value.email?.toString().trim(),
      password: this.partnerSettingForm.value.password?.toString().trim(),
      companyname: this.partnerSettingForm.value.companyname?.toString().trim(),
    })
    this.partnerSettingForm.markAllAsTouched();
    if (this.partnerSettingForm.valid) {
      this.form_data = new FormData;
      this.form_data.append('update_id', this.partner_id);
      this.form_data.append('first_name', this.partnerSettingForm.value.first_name)
      this.form_data.append('last_name', this.partnerSettingForm.value.last_name)
      if(this.partnerSettingForm.value.phone){
        this.form_data.append('phone', this.partnerSettingForm.value.phone)
      }
      if(this.partnerSettingForm.value.email){
        this.form_data.append('email', this.partnerSettingForm.value.email)
      }
      if(this.partnerSettingForm.value.password){
        this.form_data.append('password' , this.partnerSettingForm.value.password)
      }
      if (this.imagefile) {
        this.form_data.append('picture', this.imagefile)
      }
      if(this.documentfile) {
        this.form_data.append('government_id_proof', this.documentfile)
      }
      this.form_data.append('country', this.partnerSettingForm.value.country)
      if(this.partnerSettingForm.value.country_phone_code){
        this.form_data.append('country_phone_code', this.partnerSettingForm.value.country_phone_code)
      }
      this.form_data.append('partner_company_name', this.partnerSettingForm.value.companyname)
      this.form_data.append('address', this.autocomplete_address)
      this.form_data.append('type', this.type)

      this.commonService.updateItemByType(this.form_data).then((res_data : any) => {
        if(res_data.success){
          this.modalRef.hide()
        }
      })
    }
  }

  editVehicle(vehicle, i) {
    vehicle.is_edit = !vehicle.is_edit;
    vehicle.is_disable = !vehicle.is_disable;
    this.isCollapsed = !this.isCollapsed;
    this.isDocumentEdit = false;
    this.babyseat = false
    this.hotspot = false
    this.handicap = false
    this.partnerVehicleForm.patchValue({
      name: this.vehicleDetails[i].name,
      plate_no: this.vehicleDetails[i].plate_no,
      model: this.vehicleDetails[i].model,
      color: this.vehicleDetails[i].color,
      passing_year: this.vehicleDetails[i].passing_year,
      accessibility: this.vehicleDetails[i].accessibility,
      isAssign: this.isAssign
    })

    if (vehicle.is_edit) {
      let json = {
        provider_id: this.partner_id,
        type: this.type
      }
      this.serviceType.fetchServiceTypeList(json).then((res_data: any) => {

        this.vehicleType = res_data.service_list;
        let serviceType = res_data.service_list.filter((value) => {
          return value.type_detail._id == this.vehicleDetails[i].admin_type_id;
        })
        
        this.serviceTypeId = this.vehicleDetails[i].admin_type_id;
        if (serviceType.length != 0) {
          this.partnerVehicleForm.patchValue({
            service_type: serviceType[0].type_detail.typename,
          })
        }

      })
    }
  }


  yearsValidation(control: AbstractControl): any {
    let date = new Date()
    if (control.value > date.getFullYear()) {
      return { yearInvalid: true }
    }
    return null
  }

  updateVehicle(vehicle) {
    this.partnerVehicleForm.patchValue({
      name: this.partnerVehicleForm.value.name?.toString().trim(),
      plate_no: this.partnerVehicleForm.value.plate_no?.toString().trim(),
      model: this.partnerVehicleForm.value.model?.toString().trim(),
      color: this.partnerVehicleForm.value.color?.toString().trim(),
    })
    this.partnerVehicleForm.markAllAsTouched();
    let formData = new FormData;
    formData.append('_id', this.partner_id);
    formData.append('vehicle_id', vehicle._id);
    formData.append('name', this.partnerVehicleForm.value.name);
    formData.append('plate_no', this.partnerVehicleForm.value.plate_no);
    formData.append('model', this.partnerVehicleForm.value.model);
    formData.append('color', this.partnerVehicleForm.value.color);
    formData.append('passing_year', this.partnerVehicleForm.value.passing_year);
    formData.append('is_assign', this.partnerVehicleForm.value.isAssign);
    formData.append('type', this.type);
    
    if(this.serviceTypeId){
      formData.append('service_type', this.serviceTypeId);
    }
    if(this.partnerVehicleForm.value.accessibility){

      let sorted = this.partnerVehicleForm.value.accessibility.sort()
      for (const element of sorted) {
          formData.append('accessibility[]', element)
      }
    }
    if (this.partnerVehicleForm.valid) {
      this.partnerService.partnerVehicleUpdate(formData).then((res_data : any) => {
        this.is_edit = false
        vehicle.is_edit = false
        this.isCollapsed = false
        if(res_data.success){
          this.commonService.fetchUpdateData(this.updateParameters).then((res_data: any) => {
            this.requestList = res_data;
            this.listData = res_data.type_detail[0];
            this.vehicleDetails = this.listData.vehicle_detail;
          })
        }
      })
      this.partnerVehicleForm.reset();
    }
  }

  serviceTypeChange(event) {
    this.serviceTypeId = event;
  }

  deleteItem() {
    this.confirmModelRef = this.modalService.show(this.confirmationTemplate, this.confirmationModalConfig);
  }

  cancel() {
    this.confirmModelRef.hide()
  }

  async confirm() {
    this.deleteById['type'] = this.type;
    this.deleteById['delete_id'] = this.partner_id;
    await this.commonService.deleteAndUpadateItem(this.deleteById).then((res_data) => {
      this.confirmModelRef.hide()
    })
  }

  onAddWallet() {
    this.addWalletModelRef = this.modalService.show(this.addWalletModelTemplate, this.confirmationModalConfig);
  }

  selectedTab(selectedTab) {
    this.tab = selectedTab;
  }

  addWalletAmount(amount) {
    this.walletDetail['type'] = this.type;
    this.walletDetail['wallet_amount'] = amount.toString();
    this.walletDetail['type_id'] = this.partner_id;
    this.commonService.addWallet(this.walletDetail).then((res_data) => {
      this.addWalletModelRef.hide();
      this.wallet_amount = 0;
    })
  }

  wallet_amount_validator(event) {
    if (this.wallet_amount > this.max_number ) {
      this.isError = true
      return false
    } else {
      this.isError = false
    }
  }

  onSelectImageFile(event, type) {  //1: vehicle, 2: document, 3: Profile
    let files = event.target.files;
    if (files.length === 0)
      return;
    const mimeType = files[0].type;
    let fileType ;

    if(type!=3) {
      fileType=this._helper.uploadFile.filter((element)=> {
              return mimeType==element;
          })
    }else {
      if(mimeType.includes('pdf') && files[0].size > PDFSIZE) {
        this._notifierService.showNotification('error', this._helper.trans.instant('validation-title.document-size')); 
        return;
       }
      fileType=this._helper.uploadDocFile.filter((element)=> {
              return mimeType==element;
          })
    }

    if (mimeType != fileType) {
      if(type!=3){
        this._notifierService.showNotification('error', this._helper.trans.instant('validation-title.invalid-image-format'));
        return;
      }else{
        this._notifierService.showNotification('error', this._helper.trans.instant('validation-title.invalid-document-format')); 
        return;
      }
    }else{ 
      if (type == 1) {
        this.imagefile = files[0]
        const reader = new FileReader();
        reader.readAsDataURL(this.imagefile);
        reader.onload = (_event) => {
          this.upload_provider_image = reader.result;
        }
      }
      if (type == 2) {
        this.documentfile = files[0]
        const reader = new FileReader();
        reader.readAsDataURL(this.documentfile);
        reader.onload = (_event) => {
        this.idProof = reader.result;
        }
      }
      if (type == 3) {
      this.vehicleDocumentFile = files[0]
      const reader = new FileReader();
      reader.readAsDataURL(this.vehicleDocumentFile);
      if(mimeType !='application/pdf') {
        reader.onload=(_event)=> {
          this.vehicleDocument[this.documentIndex].document_picture=reader.result;
        }
      }else {
        reader.onload=(_event)=> {
          this.vehicleDocument[this.documentIndex].document_picture=DEFAULT_IMAGE.DEFAULT_PDF_IMG
        }
      }
      }

    }
  }


  vehicleDocumentList(vehicle) {
    // this.accessibilitys.push(new FormControl(vehicle.accessibility))
    let json: any = {
      _id: this.partner_id,
      vehicle_id: vehicle._id
    }
    if (vehicle.is_edit) {
      this.partnerService.fetchDocumentList(json).then((res_data: any) => {
        this.vehicleDocument = res_data.partner_vehicle_document;
        this.vehicleDocument.forEach(document => {
          if(document.document_picture){
            document.document_picture = this._helper.image_url + document.document_picture ;     
            if(document.document_picture.split(".").pop() != 'pdf'){
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
            }else{
              document.is_download = true;
            }
          }
        })

      })
    }
  }

  close() {
    this.isCollapsed = false;
    this.is_edit = false;
    this.isDocumentEdit = false;
  }

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

  onVehicelDocumentUpdate(document, formValue, vehicle) {
    document.is_update_clicked = true;
    if((document.is_expired_date && !this.updateDocument.value.expired_date) || (document.is_unique_code && !this.updateDocument.value.unique_code)){
      return
    }
    this.vehicleFormData = new FormData;
    this.vehicleFormData.append('_id', document._id);
    this.vehicleFormData.append('type',this.type);
    this.vehicleFormData.append('expired_date', formValue.expired_date || '');
    this.vehicleFormData.append('unique_code', formValue.unique_code || '');

    if(!this.vehicleDocument[this.documentIndex].document_picture){
      return this.toaster.error("Please Upload Image")
    }

    if (this.vehicleDocumentFile) {
      this.vehicleFormData.append('document_picture', this.vehicleDocumentFile || '');
    }
    
    if(this.vehicleDocument[this.documentIndex].document_picture){
      this.partnerService.updateDocument(this.vehicleFormData).then((res_data) => {
        this.isDocumentEdit = false
        document.isDocumentEdit = false;
        this.vehicleDocumentFile = null ;
        this.userObservable = this.partnerService._userObservable.subscribe((data) => {
          this.vehicleDocumentList(vehicle)
        })
      })
    }
  }

  getDriver() {
    let historyData = {
      _id  :  this.partner_id ,
      type_name : this.PANEL_NAME.PARTNER ,
      name :  this.listData.first_name + ' ' + this.listData.last_name ,
      export_request_type : this.EXPORT_HISTORY_REQUEST_TYPE.PARTNER
    }
    localStorage.setItem("historyData" , JSON.stringify(historyData))
    this._helper.selected_id = this.partner_id;
    this._helper.type = this.PANEL_TYPE.PARTNER ;
    this.modalRef.hide();
    this._helper._route.navigate(['/app/users/driver-user'])
  }

  getHistory(){
    let historyData = {
      _id  :  this.partner_id ,
      type  :  this.type ,
      type_name : this.PANEL_NAME.PARTNER ,
      name :  this.listData.first_name + ' ' + this.listData.last_name ,
      export_request_type : this.EXPORT_HISTORY_REQUEST_TYPE.PARTNER
    }
    localStorage.setItem("historyData" , JSON.stringify(historyData))
    this.modalRef.hide();
    this._helper._route.navigate(['/app/users/partner/history'])
  }

  downloadImage(image_url, docName) {
    let split_image_url = image_url.split(this.IMAGE_URL)
    if (split_image_url[1] != '') {
      // window.open(image_url)
    }
    this._helper.downloadUrl(image_url)
      .subscribe(
        imgData => {
          this._helper.downloadImage(imgData, docName)
        },
      );
  }

  //google place autocomplete for searchbox
  _initAutocomplete() {
    let autocompleteElm = <HTMLInputElement>document.getElementById('address');
    let autocomplete = new google.maps.places.Autocomplete((autocompleteElm), { types: ['(cities)'], componentRestrictions: { country: this.listData?.country_detail?.countrycode } });

    autocomplete.addListener('place_changed', () => {
      this.location = [];
      let place = autocomplete.getPlace();
      let lat = place?.geometry?.location?.lat();
      let lng = place?.geometry?.location?.lng();
      let address = place['formatted_address'];
      this.location = [lat,lng];
      if(lat && lng){
        this.partnerSettingForm.patchValue({
          address : address
        })
        this.autocomplete_address = address;
      }else{
        this.partnerSettingForm.patchValue({
          address : ''
        })
        this.autocomplete_address = '';
      }
    });
    $('.search-address').find("#address").on("focus click keypress", () => {
      $('.search-address').css({ position: "relative" }).append($(".pac-container"));
    });
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
