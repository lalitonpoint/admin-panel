import { Helper } from '../../../shared/helper';
import { CommonService } from 'src/app/services/common.service';
import { UserService } from '../../../services/user.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { DEFAULT_IMAGE, EXPORT_HISTORY_REQUEST_TYPE, PANEL_NAME, PANEL_TYPE ,PDFSIZE } from 'src/app/constants/constants';
import { NotifiyService } from 'src/app/services/notifier.service';
import { PartnerService } from 'src/app/services/partner.service';
import * as $ from 'jquery';

declare let google;

@Component({
  selector: 'app-user-model',
  templateUrl: './user-model.component.html',
  styleUrls: ['./user-model.component.scss'],
})
export class UserModelComponent implements OnInit {
  modalRef: BsModalRef;
  addWalletModelRef: BsModalRef;
  confirmModelRef: BsModalRef;
  historyTypeModelRef: BsModalRef;
  userDetailForm: UntypedFormGroup;
  form: UntypedFormGroup;
  updateDocumentForm: UntypedFormGroup;
  form_data: FormData;
  imagefile: Blob;
  DEFAULT_IMAGE = DEFAULT_IMAGE.DOCUMENT_PROFILE;
  IMAGE_URL = environment.IMAGE_URL;
  PANEL_NAME = PANEL_NAME ;
  PANEL_TYPE = PANEL_TYPE ;
  EXPORT_HISTORY_REQUEST_TYPE = EXPORT_HISTORY_REQUEST_TYPE;
  updateParameters = {};
  user_id: any;
  type: any;
  requestList: any;
  listData: any;
  wallet_amount: number = 0;
  destinationCityList: any;
  userDocument: any[] = [];
  userImage: any;
  uploadDocument: Blob;
  userReferral: any;
  selected_document_index: any;
  timezone_for_display_date: string = '';
  tab: number = 1;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right',
  };
  confirmationModalConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  fiveRate = 4;
  max_number = 9999;
  hidden = true;
  isDocumentEdit = false;
  isError: boolean = false;
  userStatus: boolean;
  editData: boolean = false;
  is_edit_doc: boolean = false;
  is_image_uploaded: boolean = false;
  todayDate: Date = new Date();
  history_type: number;
  first_name_error: boolean = false;
  last_name_error: boolean = false;

  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  @ViewChild('confirmationTemplate', { static: true }) confirmationTemplate: TemplateRef<any>;
  @ViewChild('addWalletModelTemplate', { static: true }) addWalletModelTemplate: TemplateRef<any>;
  @ViewChild('historyTypeModel', { static: true }) historyTypeModel: TemplateRef<any>;

  constructor(private partnerService: PartnerService,private modalService: BsModalService,private _fb: UntypedFormBuilder,private userservice: UserService,private commonService: CommonService,public _helper: Helper,private _notifierService: NotifiyService) {}

  ngOnInit(): void {
    if(this._helper.has_permission(this._helper.PERMISSION.VIEW, 'completed_requests')){
      this.history_type = this._helper.OPEN_HISTORY_TYPE.NORMAL;
    }else{
      this.history_type = this._helper.OPEN_HISTORY_TYPE.OPEN_RIDE;
    }
    this._helper.display_date_timezone.subscribe((data) => {
      this.timezone_for_display_date = data;
    });
  }

  show(id, type, status): void {
    this.first_name_error = false;
    this.last_name_error = false;
    this._initForm();
    if (id != '') {
      this.updateParameters['_id'] = id;
      this.updateParameters['type'] = type;
      this.user_id = id;
      this.type = type;
      this.userStatus = status;
      this.commonService
        .fetchUpdateData(this.updateParameters)
        .then((res_data: any) => {
          if(res_data.success){
            this.modalRef = this.modalService.show(this.template, this.config);
            this.requestList = res_data;
            this.listData = res_data.type_detail[0];
            if(!res_data.is_show_email){
              this.userDetailForm.get('email').disable()
            }
            if(!res_data.is_show_phone){
              this.userDetailForm.get('country_phone_code').disable()
              this.userDetailForm.get('phone').disable()
            }
            this.userImage = this._helper.image_url + this.listData.picture;
            this.tab = 1;
            this._patchForm();
            if (this.requestList.is_show_email !== false) {
              this.userDetailForm.controls['email'].setValidators([
                Validators.email,
                Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
              ]);
            }
            this.getRefrralHistory();
          }
        });
    }
    if(!this._helper.has_permission(this._helper.PERMISSION.EDIT)){
      this.userDetailForm.disable();
    }
  }

  _initForm() {
    this.userDetailForm = this._fb.group({
      first_name: new UntypedFormControl('', [Validators.required]),
      last_name: new UntypedFormControl('', [Validators.required]),
      phone: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(this._helper.admin_setting_details?.minimum_phone_number_length ? this._helper.admin_setting_details.minimum_phone_number_length : 8),
        Validators.maxLength(this._helper.admin_setting_details?.maximum_phone_number_length ? this._helper.admin_setting_details.maximum_phone_number_length : 12),
      ]),
      email: new UntypedFormControl(''),
      address: new UntypedFormControl(''),
      country_phone_code: new UntypedFormControl(''),
      zip_code: new UntypedFormControl('', [Validators.minLength(5)]),
      password: new UntypedFormControl('', [Validators.minLength(6)]),
    });

    this.updateDocumentForm = this._fb.group({
      expired_date: new UntypedFormControl(''),
      unique_code: new UntypedFormControl(''),
    });
  }

  _patchForm() {
    this.userDetailForm.patchValue({
      first_name: this.listData.first_name,
      last_name: this.listData.last_name,
      phone: this.listData.phone,
      email: this.listData.email,
      country_phone_code: this.listData.country_phone_code,
      zip_code: this.listData.partner_company_name,
    });
    if (this.listData.address != null && this.listData.address != 'null') {
      this.userDetailForm.patchValue({ address: this.listData.address });
    }
  }

  selectedTab(selectedTab) {
    this.tab = selectedTab;
    if (this.tab == 2) {
      this.documentList();
      this.is_edit_doc = false;
    }
  }

  _initAutocomplete() {
    let autocompleteElm = <HTMLInputElement>document.getElementById('address');
    google.maps.event.clearInstanceListeners(autocompleteElm);
    let autocomplete = new google.maps.places.Autocomplete(autocompleteElm, {
      types: [],
    });
    autocomplete.addListener('place_changed', () => {
      let place = autocomplete.getPlace();
      let lat = place.geometry.location.lat();
      let lng = place.geometry.location.lng();
      let address = place['formatted_address'];
      this.userDetailForm.patchValue({
        address: address,
        latitude: lat,
        longitude: lng,
      });
    });
    $('.search-address').find('#address').on('focus click keypress', () => {$('.search-address').css({ position: 'relative' }).append($('.pac-container'));});
  }

  onSelectImageFile(event, type) {
    // 1: Profile, 2: document,
    let files = event.target.files;
    if (files.length === 0) return;
    let mimeType = files[0].type;

    let fileType;
    if (type == 1) {
      fileType = this._helper.uploadFile.filter((element) => {
        return mimeType == element;
      });
    } else {
      if (mimeType.includes('pdf') && files[0].size > PDFSIZE) {
        this._notifierService.showNotification(
          'error',
          this._helper.trans.instant('validation-title.document-size')
        );
        return;
      }
      fileType = this._helper.uploadDocFile.filter((element) => {
        return mimeType == element;
      });
    }

    if (fileType != mimeType) {
      if (type == 1) {
        this._notifierService.showNotification(
          'error',
          this._helper.trans.instant('validation-title.invalid-image-format')
        );
        return;
      } else {
        this._notifierService.showNotification(
          'error',
          this._helper.trans.instant('validation-title.invalid-document-format')
        );
        return;
      }
    } else {
      if (type == 1) {
        this.imagefile = files[0];
        const reader = new FileReader();
        reader.readAsDataURL(this.imagefile);
        reader.onload = (_event) => {
          this.userImage = reader.result;
        };
      }
      if (type == 2) {
        this.uploadDocument = files[0];
        const reader = new FileReader();
        reader.readAsDataURL(this.uploadDocument);
        if (mimeType != 'application/pdf') {
          reader.onload = (_event) => {
            this.userDocument[this.selected_document_index].document_picture =
              reader.result;
          };
        } else {
          reader.onload = (_event) => {
            this.userDocument[this.selected_document_index].document_picture =
              DEFAULT_IMAGE.DEFAULT_PDF_IMG;
          };
        }
      }
    }
  }

  userUpdate() {
    if(this.first_name_error || this.last_name_error){
      if (this.first_name_error) {
        document.getElementById('first_name')?.focus();
      } else if (!this.first_name_error && this.last_name_error) {
        document.getElementById('last_name')?.focus();
      }
      return;
    }
    this.userDetailForm.patchValue({
      first_name : this.userDetailForm.value.first_name?.toString().trim(),
      last_name : this.userDetailForm.value.last_name?.toString().trim(),
      password : this.userDetailForm.value.password?.toString().trim(),
      email : this.userDetailForm.value.email?.toString().trim(),
      address : this.userDetailForm.value.address?.toString().trim(),
      zip_code : this.userDetailForm.value.zip_code?.toString().trim(),
    })
    if (this.userDetailForm.invalid) {
      this.userDetailForm.markAllAsTouched();
      return;
    }
    if (this.userDetailForm.valid) {
      this.form_data = new FormData();
      this.form_data.append('update_id', this.user_id);
      this.form_data.append('first_name', this.userDetailForm.value.first_name);
      this.form_data.append('last_name', this.userDetailForm.value.last_name);
      if(this.userDetailForm.value.phone){
        this.form_data.append('phone', this.userDetailForm.value.phone);
      }
      if (this.userDetailForm.value.password) {
        this.form_data.append('password', this.userDetailForm.value.password);
      }
      if(this.userDetailForm.value.email){
        this.form_data.append('email', this.userDetailForm.value.email);
      }
      if(this.userDetailForm.value.country_phone_code){
        this.form_data.append('country_phone_code',this.userDetailForm.value.country_phone_code);
      }
      this.form_data.append('address', this.userDetailForm.value.address);
      this.form_data.append('zipcode', this.userDetailForm.value.zip_code);
      if (this.imagefile) {
        this.form_data.append('picture', this.imagefile);
      }
      this.form_data.append('type', this.type);
      this.commonService
        .updateItemByType(this.form_data)
        .then((res_data: any) => {
          if (res_data.success) {
            this.onClose();
          }
        });
    }
  }

  deleteItem() {
    this.confirmModelRef = this.modalService.show(
      this.confirmationTemplate,
      this.confirmationModalConfig
    );
  }

  cancel() {
    this.confirmModelRef.hide();
  }

  async confirm() {
    let json = {
      type: this.type,
      delete_id: this.user_id,
    };

    await this.commonService.deleteAndUpadateItem(json).then((res_data) => {
      this.confirmModelRef.hide();
    });
  }

  onAddWallet() {
    this.addWalletModelRef = this.modalService.show(
      this.addWalletModelTemplate,
      this.confirmationModalConfig
    );
  }

  addWalletAmount(amount) {
    let json = {
      type: this.type,
      wallet_amount: amount.toString(),
      type_id: this.user_id,
    };

    this.commonService.addWallet(json).then((res_data) => {
      this.addWalletModelRef.hide();
      this.wallet_amount = 0;
    });
  }

  wallet_amount_validator(event) {
    if (this.wallet_amount > this.max_number) {
      this.isError = true;
      return false;
    } else {
      this.isError = false;
    }
  }

  documentList() {
    // this.accessibilitys.push(new FormControl(vehicle.accessibility))
    let json: any = {
      _id: this.user_id,
      type: this.type,
    };
    this.userservice.fetchDocumentList(json).then((res_data: any) => {
      this.userDocument = res_data.user_document;
      res_data.user_document.forEach((document) => {
        document.document_picture = this.IMAGE_URL + document.document_picture;
        if (document.document_picture.split('.').pop() != 'pdf') {
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
      });
    });
  }

  getRefrralHistory() {
    let json = {
      _id: this.user_id,
    };
    this.userservice.getUserRefrralHistory(json).then((res_data: any) => {
      this.userReferral = res_data.user_referral;
    });
  }

  getHistory() {
    let historyData = {
      _id: this.user_id,
      type: this.PANEL_TYPE.USER,
      type_name: this.PANEL_NAME.USER,
      name: this.listData.first_name + ' ' + this.listData.last_name,
      export_request_type : this.EXPORT_HISTORY_REQUEST_TYPE.USER
    };
    localStorage.setItem('historyData', JSON.stringify(historyData));
    this.hideHistoryTypeModel();
    this.onClose();
    this.history_type = this._helper.OPEN_HISTORY_TYPE.NORMAL;
    if(this.history_type == this._helper.OPEN_HISTORY_TYPE.NORMAL){
      this._helper._route.navigate(['/app/users/user/history']);
    }else{
      this._helper._route.navigate(['/app/users/user/open_ride_history']);
    }
  }

  onDownload(image_url, docname) {
    let split_image_url = image_url.split(this.IMAGE_URL);
    if (split_image_url[1] != '') {
      // window.open(image_url)
    }
    this._helper.downloadUrl(image_url).subscribe(
      (imgData) => {
        this._helper.downloadImage(imgData, docname);
      }
    );
  }

  onClose() {
    this.modalRef.hide();
    this.first_name_error = false;
    this.last_name_error = false;
  }

  onEdit(document, i) {
    this.is_edit_doc = true;
    this.selected_document_index = i;
    this.uploadDocument = null;
    document.is_edit_doc = true;
    if (
      this.userDocument[i].option == 1 &&
      this.userDocument[i].document_picture == this.IMAGE_URL
    ) {
      this.is_image_uploaded = true;
    } else {
      this.is_image_uploaded = false;
    }
  }
  // driver document update
  updateDocuments(data: any) {
    data.is_update_clicked = true;
    if (
      (data.is_expired_date && !data.expired_date) ||
      (data.is_unique_code && !data.unique_code)
    ) {
      return;
    }
    if (data.expired_date) {
      data.expired_date = new Date(data.expired_date).setHours(23,59,59,59);
    }
    let documentsForm = new FormData();
    documentsForm.append('type', this.type);
    documentsForm.append('expired_date', data.expired_date || '');
    documentsForm.append('unique_code', data.unique_code || '');
    if (this.uploadDocument) {
      documentsForm.append('pictureData', this.uploadDocument || '');
    }
    documentsForm.append('_id', data._id);
    if (this.is_image_uploaded) {
      if (!this.uploadDocument) {
        this._notifierService.showNotification(
          'error',
          this._helper.trans.instant('validation-title.please_upload_image')
        );
        return;
      }
    }
    if (this.uploadDocument || data.expired_date || data.unique_code) {
      this.partnerService.updateDocument(documentsForm).then((is_update) => {
        this.documentList();
        if (is_update) {
          data.is_edit_doc = false;
        }
        this.uploadDocument = null;
      });
    } else {
      if (
        this.userDocument[this.selected_document_index].document_picture !==
        this.IMAGE_URL
      ) {
        data.is_edit_doc = false;
        this.is_edit_doc = false;
        this.is_image_uploaded = false;
        return;
      }
      this._notifierService.showNotification(
        'error',
        this._helper.trans.instant('validation-title.please_upload_image')
      );
      return;
    }
    this.is_edit_doc = false;
    this.is_image_uploaded = false;
  }

  openHistoryTypeModal(){
    this.historyTypeModelRef = this.modalService.show(this.historyTypeModel,this.confirmationModalConfig);
  }

  hideHistoryTypeModel(){
    this.historyTypeModelRef?.hide();
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
