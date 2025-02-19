import { Helper } from '../../../shared/helper';
import { Component, EventEmitter, HostListener, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UntypedFormControl, UntypedFormGroup, UntypedFormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { DEFAULT_IMAGE, EXPORT_HISTORY_REQUEST_TYPE, PANEL_NAME, PDFSIZE, RENT_VEHICLE_STATUS } from 'src/app/constants/constants';
import { environment } from 'src/environments/environment';
import { CountryService } from 'src/app/services/country.service';
import { CityService } from 'src/app/services/city.service';
import { ServiceTypeService } from 'src/app/services/service-type.service';
import { PartnerService } from 'src/app/services/partner.service';
import { NotifiyService } from 'src/app/services/notifier.service';
import * as $ from "jquery";
import { UserService } from 'src/app/services/user.service';
import { DriverService } from 'src/app/services/driver.service';
import { OwlOptions } from "ngx-owl-carousel-o";

declare const google;

@Component({
    selector: 'app-edit-driver-modal',
    templateUrl: './edit-driver-modal.component.html',
    styleUrls: ['./edit-driver-modal.component.scss']
})
export class EditDriverModalComponent implements OnInit {
    customOptions: OwlOptions = {
        loop: true,
        autoplay: true,
        center: true,
        dots: true,
        autoHeight: false,
        autoWidth: false,
        items : 1,

    }
    fiveRate = 4;
    confirmModelRef: BsModalRef;
    modalRef: BsModalRef;
    addWalletModelRef: BsModalRef;
    historyTypeModelRef: BsModalRef;
    rentVehicleModelRef: BsModalRef;
    rejectModelref: BsModalRef;
    config = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-right'
    };
    confirmationModalConfig = {
        backdrop: true,
        ignoreBackdropClick: true,
    };
    vehicleDetailModelConfig = {
        backdrop: true,
        ignoreBackdropClick: true,
        class: 'modal-md modal-dialog-centered',
    }
    IMAGE_URL = environment.IMAGE_URL;
    DEFAULT_IMAGE = DEFAULT_IMAGE.DOCUMENT_PROFILE;
    USER_PROFILE = DEFAULT_IMAGE.USER_SQUARE;
    RENT_VEHICLE_STATUS = RENT_VEHICLE_STATUS;
    profile_image: any = this.DEFAULT_IMAGE;
    PANEL_NAME = PANEL_NAME;
    EXPORT_HISTORY_REQUEST_TYPE = EXPORT_HISTORY_REQUEST_TYPE;
    driverDetailForm: UntypedFormGroup;
    providerVehicleForm: UntypedFormGroup;
    updateDocument: UntypedFormGroup;
    vehicleFormData: FormData;
    form_data: FormData;
    addVehicle: UntypedFormGroup;
    wallet_amount: number = 0;
    cityData: any;
    vehicleData: any;
    selectedDocumentIndex: any;
    requestList: any;
    listData: any;
    vehicleDetails: any;
    vehicleType: any[] = [];
    userObservable: any;
    vehicleDocument: any[] = [];
    deleteById = {};
    walletDetail = {};
    updateParameters = {};
    city_list: any = [];
    driverReferral: any;
    driverRentVehicleList: any;
    imagefile: Blob;
    vehicleDocumentFile: Blob;
    driver_id: string;
    type: string;
    timezone_for_display_date: string = '';
    max_number = 9999;
    documentIndex: number;
    tab: number = 1;
    isEdit: boolean = false;
    isError: boolean = false;
    isDocumentEdit = false;
    isCollapsed: boolean = false;
    is_edit: boolean = false;
    addNewVehicle: boolean = false;
    driverStatus: boolean;
    is_from_rental: boolean = false;
    image_type: number;
    uploadDocument: Blob;
    selected_document_index: any;
    providerDocument: any[] = [];
    todayDate: Date = new Date();
    is_edit_doc: boolean = false;
    is_image_uploaded: boolean = false;
    year: Date = new Date();
    currentYear = this.year.getFullYear();
    history_type: number;
    service_type_name: any;
    first_name_error: boolean = false;
    last_name_error: boolean = false;
    selected_rent_vehicle_id:any;
    selected_rent_vehicle_detail:any;
    rejection_reason: string = "";
    is_rejection_reason_error: boolean = false;
    is_use_wsal_service:boolean = false;

    @ViewChild('template', { static: true }) template: TemplateRef<any>;
    @ViewChild('addWalletModelTemplate', { static: true }) addWalletModelTemplate: TemplateRef<any>;
    @ViewChild('confirmationTemplate', { static: true }) confirmationTemplate: TemplateRef<any>;
    @ViewChild('historyTypeModel', { static: true }) historyTypeModel: TemplateRef<any>;
    @ViewChild('rentVehicleTemplate', { static: true }) rentVehicleTemplate: TemplateRef<any>;
    @ViewChild('rejectTemplate', { static: true }) rejectTemplate: TemplateRef<any>;
    @Output() driverHandler: EventEmitter<any> = new EventEmitter();

    @HostListener('document:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        if (event.key === 'Escape' || event.code === 'Escape') {
            this.modalRef?.onHidden.subscribe(() => {
                this.closeModal();
            })
        }
    }

    constructor(private _driverService: DriverService, private userservice: UserService, private modalService: BsModalService, private _fb: UntypedFormBuilder, public _helper: Helper, private commonService: CommonService, private _countryService: CountryService, private _cityService: CityService, private serviceType: ServiceTypeService, private partnerService: PartnerService, private _notifierService: NotifiyService) { }

    ngOnInit(): void {
        this.is_use_wsal_service = this._helper?.admin_setting_details?.is_wsal_service_use;
        if (this._helper.has_permission(this._helper.PERMISSION.VIEW, 'completed_requests')) {
            this.history_type = this._helper.OPEN_HISTORY_TYPE.NORMAL;
        } else {
            this.history_type = this._helper.OPEN_HISTORY_TYPE.OPEN_RIDE;
        }
        this._helper.display_date_timezone.subscribe(data => {
            this.timezone_for_display_date = data;
        })
    }

    show(driver_id, type, status, is_from_rental = false): void {
        this.first_name_error = false;
        this.last_name_error = false;
        this.driverStatus = status;
        this.is_from_rental = is_from_rental;
        this._initForm();
        if (driver_id != '') {
            this.updateParameters['_id'] = driver_id;
            this.updateParameters['type'] = type.toString();
            this.driver_id = driver_id;
            this.type = type;
            this.commonService.fetchUpdateData(this.updateParameters).then((res_data: any) => {
                if(res_data.success){
                    this.requestList = res_data;
                    if(!res_data.is_show_email){
                        this.driverDetailForm.get('email').disable()
                    }
                    if(!res_data.is_show_phone){
                        this.driverDetailForm.get('country_phone_code').disable()
                        this.driverDetailForm.get('phone').disable()
                    }
                    this.listData = res_data.type_detail[0];
                    if (this.listData.provider_type == 2) {
                        this.providerVehicleForm.disable();
                    }
                    this.profile_image = this.IMAGE_URL + this.listData.picture;
                    this.driverDetailForm.patchValue(this.listData);
                    if (this.requestList.is_show_email !== false) {
                        this.driverDetailForm.controls['email'].setValidators([Validators.email, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')])
                    }
                    this.vehicleDetails = this.listData.vehicle_detail;
                    this.modalRef = this.modalService.show(this.template, this.config);
                    this._initAutocomplete();
                    this.getCountryList();
                }
            })
        }
        if (!this._helper.has_permission(this._helper.PERMISSION.EDIT)) {
            this.driverDetailForm.disable();
            this.providerVehicleForm.disable();
        }
    }

    _initForm() {
        this.driverDetailForm = this._fb.group({
            first_name: new UntypedFormControl('', [Validators.required]),
            last_name: new UntypedFormControl('', [Validators.required]),
            phone: new UntypedFormControl('', [Validators.required, Validators.minLength(this._helper.admin_setting_details?.minimum_phone_number_length ? this._helper.admin_setting_details.minimum_phone_number_length : 8), Validators.maxLength(this._helper.admin_setting_details?.maximum_phone_number_length ? this._helper.admin_setting_details.maximum_phone_number_length : 12)]),
            country_phone_code: new UntypedFormControl(''),
            email: new UntypedFormControl('', [Validators.required]),
            city: new UntypedFormControl(''),
            address: new UntypedFormControl(''),
            latitude: new UntypedFormControl(''),
            longitude: new UntypedFormControl(''),
            password: new UntypedFormControl(null, [Validators.minLength(6)]),
            national_id: new UntypedFormControl(''),
            date_of_birth: new UntypedFormControl(''),
        })
        this.providerVehicleForm = this._fb.group({
            name: new UntypedFormControl('', [Validators.required]),
            plate_no: new UntypedFormControl('', [Validators.required]),
            model: new UntypedFormControl('', [Validators.required]),
            color: new UntypedFormControl('', [Validators.required]),
            passing_year: new UntypedFormControl('', [Validators.required, this.yearsValidation]),
            service_type: new UntypedFormControl('', [Validators.required]),
            accessibility: new UntypedFormControl(''),
            plate_type: new UntypedFormControl(''),
            sequence_number: new UntypedFormControl(''),
            left_plate_letter: new UntypedFormControl(''),
            center_plate_letter: new UntypedFormControl(''),
            right_plate_letter: new UntypedFormControl(''),
        })
        this.updateDocument = this._fb.group({
            expired_date: new UntypedFormControl(''),
            unique_code: new UntypedFormControl('')
        })
        this.addVehicle = new UntypedFormGroup({
            name: new UntypedFormControl(null, [Validators.required]),
            plate_no: new UntypedFormControl(null, [Validators.required]),
            modal: new UntypedFormControl(null, [Validators.required]),
            year: new UntypedFormControl(null, [Validators.required, this.yearsValidation]),
            color: new UntypedFormControl(null, [Validators.required]),
            service_type: new UntypedFormControl('', [Validators.required]),
            accessibility: new UntypedFormControl(''),
        })

    }

    _initAutocomplete() {
        let autocompleteElm = <HTMLInputElement>document.getElementById('address');
        google.maps.event.clearInstanceListeners(autocompleteElm);
        let autocomplete = new google.maps.places.Autocomplete((autocompleteElm), { types: [] });
        autocomplete.addListener('place_changed', () => {
            let place = autocomplete.getPlace();
            let lat = place.geometry.location.lat();
            let lng = place.geometry.location.lng();
            let address = place['formatted_address'];
            this.driverDetailForm.patchValue({
                address: address,
                latitude: lat,
                longitude: lng
            })
        });
        $('.search-address').find("#address").on("focus click keypress", () => {
            $('.search-address').css({ position: "relative" }).append($(".pac-container"));
        });
    }

    // get CountryList
    getCountryList() {
        this._countryService.fetchCountry().then(res => {
            if (res.success) {
                res.country_list.forEach((data) => {
                    if (this.listData.country == data.countryname) {
                        this.getCityList(data._id);
                    }
                })
            }
        })
    }

    // get city from country 
    getCityList(country_Id) {
        this._cityService.fetchDestinationCity({ country_id: country_Id }).then(res => {
            if (res.success) {
                this.city_list = res.destination_list;
            } else {
                this.city_list = []
            }
        })
    }

    // service type list
    getServiceTypeList() {
        let json: any = { provider_id: this.driver_id, type: this.type };
        this.serviceType.fetchServiceTypeList(json).then((res_data) => {
            this.vehicleType = res_data.service_list;
        })
    }

    onSelectImageFile(event, type) {
        let files = event.target.files;
        if (files.length === 0) return;
        const mimeType = files[0].type;
        let fileType;
        if (type == 1) {
            fileType = this._helper.uploadFile.filter((element) => {
                return mimeType == element;
            })
        } else {
            if (mimeType.includes('pdf') && files[0].size > PDFSIZE) {
                this._notifierService.showNotification('error', this._helper.trans.instant('validation-title.document-size'));
                return;
            }
            fileType = this._helper.uploadDocFile.filter((element) => {
                return mimeType == element;
            })
        }
        if (mimeType != fileType) {
            if (type == 1) {
                this._notifierService.showNotification('error', this._helper.trans.instant('validation-title.invalid-image-format'));
                return;
            } else {
                this._notifierService.showNotification('error', this._helper.trans.instant('validation-title.invalid-document-format'));
                return;
            }
        } else {
            if (type == 1) {
                this.imagefile = files[0];
                const reader = new FileReader();
                reader.readAsDataURL(this.imagefile);
                reader.onload = (_event) => {
                    this.profile_image = reader.result;
                }
            }
            if (type == 2) {
                this.vehicleDocumentFile = files[0];
                const reader = new FileReader();
                reader.readAsDataURL(this.vehicleDocumentFile);

                if (mimeType != 'application/pdf') {
                    reader.onload = (_event) => {
                        this.vehicleDocument[this.documentIndex].document_picture = reader.result;
                    }
                } else {
                    reader.onload = (_event) => {
                        this.vehicleDocument[this.documentIndex].document_picture = DEFAULT_IMAGE.DEFAULT_PDF_IMG
                    }
                }
            }
            if (type == 3) {
                this.uploadDocument = files[0];
                const reader = new FileReader();
                reader.readAsDataURL(this.uploadDocument);

                if (mimeType != 'application/pdf') {
                    reader.onload = (_event) => {
                        this.providerDocument[this.selected_document_index].document_picture = reader.result
                    }
                } else {
                    reader.onload = (_event) => {
                        this.providerDocument[this.selected_document_index].document_picture = DEFAULT_IMAGE.DEFAULT_PDF_IMG
                    }
                }
            }
        }
    }

    // edit vehicle
    editVehicle(vehicle, i) {
        this.vehicleData = vehicle;
        vehicle.is_edit = !vehicle.is_edit
        this.isCollapsed = !this.isCollapsed;
        this.isDocumentEdit = false;
        vehicle.is_disable = !vehicle.is_disable;
        this.providerVehicleForm.patchValue({
            name: this.vehicleDetails[i].name,
            plate_no: this.vehicleDetails[i].plate_no,
            model: this.vehicleDetails[i].model,
            color: this.vehicleDetails[i].color,
            passing_year: this.vehicleDetails[i].passing_year,
            accessibility: this.vehicleDetails[i].accessibility,
            plate_type: this.vehicleDetails[i].plate_type,
            sequence_number: this.vehicleDetails[i].sequence_number,
            left_plate_letter: this.vehicleDetails[i].left_plate_letter,
            center_plate_letter: this.vehicleDetails[i].center_plate_letter,
            right_plate_letter: this.vehicleDetails[i].right_plate_letter,
        })
        if (this.vehicleDetails[i].service_type && this.vehicleType.length > 0) {

            this.vehicleType.forEach(vehicle => {
                if (this.vehicleDetails[i].service_type == vehicle._id) {
                    this.providerVehicleForm.patchValue({
                        service_type: this.vehicleDetails[i].service_type,
                    })
                }
            })

        }
    }

    // vehicle passing year 
    yearsValidation(control: AbstractControl): any {
        let date = new Date()
        if (control.value > date.getFullYear()) {
            return { yearInvalid: true }
        }
        return null
    }

    // update vehicle 
    updateVehicle(vehicle) {
        this.providerVehicleForm.patchValue({
            name: this.providerVehicleForm.value.name?.toString().trim(),
            plate_no: this.providerVehicleForm.value.plate_no?.toString().trim(),
            model: this.providerVehicleForm.value.model?.toString().trim(),
            color: this.providerVehicleForm.value.color?.toString().trim(),
            passing_year: this.providerVehicleForm.value.passing_year?.toString().trim(),
        })
        if (this.providerVehicleForm.invalid) {
            this.providerVehicleForm.markAllAsTouched();
            return
        }
        let formData = new FormData;
        formData.append('_id', this.driver_id);
        formData.append('vehicle_id', vehicle._id);
        formData.append('name', this.providerVehicleForm.value.name);
        formData.append('plate_no', this.providerVehicleForm.value.plate_no);
        formData.append('model', this.providerVehicleForm.value.model);
        formData.append('color', this.providerVehicleForm.value.color);
        formData.append('passing_year', this.providerVehicleForm.value.passing_year);
        formData.append('service_type', this.providerVehicleForm.value.service_type);
        formData.append('type', this.type);
        if (this.providerVehicleForm.value.accessibility) {
            let sorted = this.providerVehicleForm.value.accessibility.sort()
            for (const element of sorted) {
                formData.append('accessibility[]', element)
            }
        }

        if (this.providerVehicleForm.valid) {
            this.partnerService.partnerVehicleUpdate(formData).then((res_data) => {
                this.is_edit = false
                vehicle.is_edit = false
                this.isCollapsed = false

                this.commonService.fetchUpdateData(this.updateParameters).then((res_data: any) => {
                    this.requestList = res_data;
                    this.listData = res_data.type_detail[0];
                    this.vehicleDetails = this.listData.vehicle_detail;
                })
            })
        }
    }

    // vehicle document list
    vehicleDocumentList(vehicle) {
        let json: any = {
            _id: this.driver_id,
            vehicle_id: vehicle._id
        }
        if (vehicle.is_edit || this.tab == 3) {
            this.partnerService.fetchDocumentList(json).then((res_data: any) => {
                this.vehicleDocument = res_data.provide_vehicle_document;
                this.providerDocument = res_data.provider_document;
                res_data.provider_document.forEach(document => {
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
                res_data.provide_vehicle_document.forEach(document => {
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
            })
        }
    }

    // vehicle document data fetch
    onVehicelDocumentEdit(document, i) {
        this.documentIndex = i;
        this.isDocumentEdit = true;
        document.isDocumentEdit = true;
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
        this.partnerService.updateDocument(this.vehicleFormData).then((res_data) => {
            this.vehicleDocumentFile = null;
            this.userObservable = this.partnerService._userObservable.subscribe((data) => {
                this.isDocumentEdit = false
                document.isDocumentEdit = false;
                this.vehicleDocumentList(vehicle)
            })
        })

    }

    // tab selection
    selectedTab(tab) {
        this.addNewVehicle = false;
        setTimeout(() => {
            this.addVehicle.reset();
        }, 500);
        this.tab = tab;
        if (this.tab == 2) {
            this.getServiceTypeList();
            this.isDocumentEdit = false;
            if (this.vehicleData) {
                this.vehicleDocumentList(this.vehicleData);
            }
        }
        if (this.tab == 3) {
            this.vehicleDocumentList('');
            this.is_edit_doc = false;
        }
        if (this.tab == 4) {
            this.getRefrralHistory();
        }
        if (this.tab == 5) {
            this.getRentVehicleList();
        }
    }

    // driver history
    getRefrralHistory() {
        let json = {
            _id: this.driver_id
        }
        this.userservice.getUserRefrralHistory(json).then((res_data: any) => {
            if (res_data.success) {
                this.driverReferral = res_data.provider_referral
            }
        })
    }

    // driver history
    getRentVehicleList() {
        let json = {
            provider_id: this.driver_id
        }
        this.userservice.getRentVehicleList(json).then((res_data: any) => {
            if (res_data.success) {
                this.driverRentVehicleList = res_data.rent_vehicle_list;
            }
        })
    }

    cityChanges(city: any) {
        this.cityData = city;
    }

    save() {
        if (this.tab == 1) {
            if (this.first_name_error || this.last_name_error) {
                if (this.first_name_error) {
                    document.getElementById('first_name')?.focus();
                } else if (!this.first_name_error && this.last_name_error) {
                    document.getElementById('last_name')?.focus();
                }
                return;
            }
            this.driverDetailForm.patchValue({
                first_name: this.driverDetailForm.value.first_name?.toString().trim(),
                last_name: this.driverDetailForm.value.last_name?.toString().trim(),
                email: this.driverDetailForm.value.email?.toString().trim(),
                password: this.driverDetailForm.value.password?.toString().trim(),
            })
            if (this.driverDetailForm.invalid) {
                this.driverDetailForm.markAllAsTouched();
            }
            if (this.driverDetailForm.valid) {
                this.form_data = new FormData;
                this.form_data.append('update_id', this.driver_id);
                this.form_data.append('first_name', this.driverDetailForm.value.first_name);
                this.form_data.append('last_name', this.driverDetailForm.value.last_name);
                if(this.driverDetailForm.value.country_phone_code){
                    this.form_data.append('country_phone_code', this.driverDetailForm.value.country_phone_code);
                }
                if(this.driverDetailForm.value.phone){
                    this.form_data.append('phone', this.driverDetailForm.value.phone);
                }
                if(this.driverDetailForm.value.email){
                    this.form_data.append('email', this.driverDetailForm.value.email);
                }
                this.form_data.append('country', this.listData.country);
                if (this.cityData != null) {
                    this.form_data.append('city', this.cityData.cityname);
                    this.form_data.append('cityid', this.cityData._id);
                } else {
                    this.form_data.append('city', this.driverDetailForm.value.city);
                }
                this.form_data.append('address', this.driverDetailForm.value.address);
                this.form_data.append('latitude', this.driverDetailForm.value.latitude);
                this.form_data.append('longitude', this.driverDetailForm.value.longitude);
                if (this.driverDetailForm.value.password != null) {
                    this.form_data.append('password', this.driverDetailForm.value.password);
                }
                if (this.imagefile) {
                    this.form_data.append('picture', this.imagefile)
                }
                this.form_data.append('type', this.type)
                this.commonService.updateItemByType(this.form_data).then((res: any) => {
                    if (res.success) {
                        this.cityData = null;
                        this.closeModal();
                    }
                })
            }
        }
    }

    onAddWallet() {
        this.addWalletModelRef = this.modalService.show(this.addWalletModelTemplate, this.confirmationModalConfig);
    }

    // open wallet add model
    addWalletAmount(amount) {
        this.walletDetail['type'] = this.type.toString();
        this.walletDetail['wallet_amount'] = amount.toString();
        this.walletDetail['type_id'] = this.driver_id;
        this.commonService.addWallet(this.walletDetail).then((res_data) => {
            this.addWalletModelRef.hide();
            this.wallet_amount = 0;
        })
    }

    wallet_amount_validator(event) {
        if (this.wallet_amount > this.max_number) {
            this.isError = true
            return false
        } else {
            this.isError = false
        }
    }

    onEdit(document, i) {
        this.is_edit_doc = true;
        this.selected_document_index = i
        document.is_edit_doc = true;
        if (this.providerDocument[i].option == 1 && this.providerDocument[i].document_picture == this.IMAGE_URL) {
            this.is_image_uploaded = true;
        } else {
            this.is_image_uploaded = false;
        }
    }

    // driver document update
    updateDocuments(data: any) {
        data.is_update_clicked = true;
        if ((data.is_expired_date && !data.expired_date) || (data.is_unique_code && !data.unique_code)) {
            return
        }
        let documentsForm = new FormData();
        documentsForm.append('type', this.type);
        documentsForm.append('expired_date', data.expired_date || "");
        documentsForm.append('unique_code', data.unique_code || "");
        if (this.uploadDocument) {
            documentsForm.append('pictureData', this.uploadDocument || "");
        }
        documentsForm.append('_id', data._id);
        if (this.is_image_uploaded) {
            if (!this.uploadDocument) {
                this._notifierService.showNotification('error', this._helper.trans.instant('validation-title.please_upload_image'));
                return;
            }
        }
        if (this.uploadDocument || data.expired_date || data.unique_code) {
            this.partnerService.updateDocument(documentsForm).then(is_update => {
                if (is_update) {
                    this.partnerService.fetchDocumentList({ _id: this.driver_id }).then((res_data: any) => {
                        this.providerDocument = res_data.provider_document;
                        res_data.provider_document.forEach(document => {
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
                    })
                    data.is_edit_doc = false;
                }
                this.uploadDocument = null;
            })
        } else {
            if (this.providerDocument[this.selected_document_index].document_picture !== this.IMAGE_URL) {
                data.is_edit_doc = false;
                this.is_edit_doc = false;
                this.is_image_uploaded = false;
                return;
            }
            this._notifierService.showNotification('error', this._helper.trans.instant('validation-title.please_upload_image'));
            return;
        }
        this.is_edit_doc = false;
        this.is_image_uploaded = false;
    }

    closeModal() {
        this.modalRef?.hide();
        this.isCollapsed = false;
        this.is_edit = false;
        this.isDocumentEdit = false;
        this.driverHandler.emit();
        setTimeout(() => {
            this.tab = 1;
            this.driverDetailForm.reset();
            this.providerVehicleForm.reset();
            this.updateDocument.reset();
        }, 500);
    }

    // delete driver 
    deleteItem() {
        this.confirmModelRef = this.modalService.show(this.confirmationTemplate, this.confirmationModalConfig);
    }

    async confirm() {
        this.deleteById['type'] = this.type;
        this.deleteById['delete_id'] = this.driver_id;
        await this.commonService.deleteAndUpadateItem(this.deleteById).then((res_data) => {
            this.confirmModelRef.hide()
        })
    }

    cancel() {
        this.confirmModelRef.hide()
    }

    // get driver history 
    getHistory() {
        let historyData = {
            _id: this.driver_id,
            type: this.type,
            type_name: this.PANEL_NAME.PROVIDER,
            name: this.listData.first_name + ' ' + this.listData.last_name,
            export_request_type: this.EXPORT_HISTORY_REQUEST_TYPE.PROVIDER
        }
        localStorage.setItem("historyData", JSON.stringify(historyData))
        this.hideHistoryTypeModel();
        this.modalRef.hide();
        this.history_type = this._helper.OPEN_HISTORY_TYPE.NORMAL;
        if (this.history_type == this._helper.OPEN_HISTORY_TYPE.NORMAL) {
            this._helper._route.navigate(['/app/users/driver-user/history'])
        } else {
            this._helper._route.navigate(['/app/users/driver-user/open_ride_history'])
        }
    }

    //add new vehicle
    newVehicle(add) {
        if (add == 'add') {
            this.addNewVehicle = true;
        } else {
            this.addNewVehicle = false;
            setTimeout(() => {
                this.addVehicle.reset();
            }, 500);
        }
    }

    // save new vehicle data
    saveNewVehicle() {
        this.addVehicle.patchValue({
            name: this.addVehicle.value.name?.toString().trim(),
            plate_no: this.addVehicle.value.plate_no?.toString().trim(),
            modal: this.addVehicle.value.modal?.toString().trim(),
            color: this.addVehicle.value.color?.toString().trim(),
            year: this.addVehicle.value.year?.toString().trim(),
        })
        if (this.addVehicle.invalid) {
            return this.addVehicle.markAllAsTouched()
        }
        let formData = new FormData()
        formData.append('provider_id', this.driver_id)
        formData.append('name', this.addVehicle.value.name)
        formData.append('plate_no', this.addVehicle.value.plate_no)
        formData.append('model', this.addVehicle.value.modal)
        formData.append('color', this.addVehicle.value.color)
        formData.append('passing_year', this.addVehicle.value.year)
        formData.append('service_type', this.addVehicle.value.service_type)
        if (this.addVehicle.value.accessibility) {
            let sorted = this.addVehicle.value.accessibility.sort()
            for (const sort of sorted) {
                formData.append('accessibility[]', sort)
            }
        }
        this._driverService.vehicle(formData).then((res) => {
            this.commonService.fetchUpdateData(this.updateParameters).then((res_data: any) => {
                this.addNewVehicle = false;
                this.listData = res_data.type_detail[0];
                this.vehicleDetails = this.listData.vehicle_detail;
                this.vehicleDetails.is_edit = false;
                this.is_edit = false;
                this.isCollapsed = false;
            })
            setTimeout(() => {
                this.addVehicle.reset();
            }, 500);
        })
    }

    // download document image
    onDownload(image_url, docname) {

        let split_image_url = image_url.split(this.IMAGE_URL)
        if (split_image_url[1] != '') {
            // window.open(image_url)
        }
        this._helper.downloadUrl(image_url)
            .subscribe(
                imgData => {
                    this._helper.downloadImage(imgData, docname)
                },
            );
    }

    openHistoryTypeModal() {
        this.historyTypeModelRef = this.modalService.show(this.historyTypeModel, this.confirmationModalConfig);
    }

    hideHistoryTypeModel() {
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

    showVehicleDetails(rentVehicle){
        this.selected_rent_vehicle_id = rentVehicle._id;
        let json = {
            vehicle_id: rentVehicle._id
        };
        this.userservice.getRentVehicleDetail(json).then((res_data: any) => {
            if(res_data.success){
                this.selected_rent_vehicle_detail = res_data.vehicle_detail;
                this.rentVehicleModelRef = this.modalService.show(this.rentVehicleTemplate, this.vehicleDetailModelConfig);
            }
        })
    }

    closeDetailModel(){
        this.rentVehicleModelRef?.hide();
        setTimeout(() => {
            this.selected_rent_vehicle_id = null;
            this.selected_rent_vehicle_detail = null;
        }, 500);
    }

    approveRejectRentVehicle(is_approved){
        if(!is_approved){
            this.rejectModelref = this.modalService.show(this.rejectTemplate, this.confirmationModalConfig);
            this.rentVehicleModelRef?.hide();
        } else {
            let json = {
                vehicle_id: this.selected_rent_vehicle_id,
                is_approved: 1
            };
            this.userservice.approvedRejectVehicleDetail(json).then((res_data: any) => {
                if(res_data.success){
                    this.closeDetailModel();
                    this.selectedTab(5)
                }
            })
        }
    }

    closeRejectModel(){
        this.rejectModelref?.hide();
        setTimeout(() => {
            this.selected_rent_vehicle_id = null;
            this.selected_rent_vehicle_detail = null;
        }, 500);
    }

    rejection_validator(){
        if(this.rejection_reason == ''){
            this.is_rejection_reason_error = true;
        } else {
            this.is_rejection_reason_error = false;
        }
    }

    rejectRentVehicle(){
        if(this.rejection_reason == ''){
            this.is_rejection_reason_error = true;
            return
        }
        let json = {
            vehicle_id: this.selected_rent_vehicle_id,
            is_approved: 0,
            reason : this.rejection_reason
        };
        this.userservice.approvedRejectVehicleDetail(json).then((res_data: any) => {
            if(res_data.success){
                this.closeRejectModel();
                this.selectedTab(5);
            }
        })
    }


}
