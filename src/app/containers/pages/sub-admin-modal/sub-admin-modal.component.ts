import { Component, EventEmitter, HostListener, OnInit, Output, TemplateRef,  ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CityService } from 'src/app/services/city.service';
import { CountryService } from 'src/app/services/country.service';
import { NotifiyService } from 'src/app/services/notifier.service';
import { SubAdminService } from 'src/app/services/sub-admin.service';
import { Helper } from 'src/app/shared/helper';
import { SubAdminUrl } from 'src/app/shared/sub-admin-url';

@Component({
  selector: 'app-sub-admin-modal',
  templateUrl: './sub-admin-modal.component.html',
  styleUrls: ['./sub-admin-modal.component.scss']
})
export class SubAdminModalComponent implements OnInit {
  searchText:string = '';
  subAdminForm: UntypedFormGroup;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right',
  };
  editAdmin: any;
  admin_urls: any[] = [];
  adminUrls: any[] = [];
  isEdit: boolean = false;
  is_sub_admin: boolean = false;
  onHidden: any;
  country_list: any = [];
  city_list: any = [];
  selectedCountries: any[] = [];
  selectedCities: any[] = [];
  select_country_error:boolean = false;
  select_city_error:boolean = false;
  all_permission_checked: boolean = false;
  all_permission_add_checked: boolean = false;
  all_permission_edit_checked: boolean = false;
  all_permission_delete_checked: boolean = false;
  all_permission_export_checked: boolean = false;
  name_error: boolean = false;

  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  @Output() add_update: EventEmitter<any> = new EventEmitter();
  
  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.code === 'Escape') {
      this.modalRef?.onHidden.subscribe(() => {
        this.onClose();
      })
    }
  }

  constructor(private modalService: BsModalService, public _helper: Helper, private _subAdminService: SubAdminService,private _subAdminUrl:SubAdminUrl,private _countryService:CountryService,private _cityService:CityService,private _notifiyService:NotifiyService) { }

  ngOnInit(): void {
    this.admin_urls = this._subAdminUrl.url_array;
  }

  show(admin): void {
    this.name_error = false;
    this.editAdmin = admin
    this.getCountryList();
  }

  _initForm(){
    this.subAdminForm = new UntypedFormGroup({
      username: new UntypedFormControl(null, Validators.required),
      email: new UntypedFormControl(null, [Validators.email ,Validators.required]),
      type: new UntypedFormControl(null, Validators.required),
      password: new UntypedFormControl('', [Validators.minLength(6), Validators.required]),
      is_show_email : new UntypedFormControl(false),
      is_show_phone : new UntypedFormControl(false),
      is_country_based_access_control_enabled : new UntypedFormControl(false),
      is_city_based_access_control_enabled : new UntypedFormControl(false),
      url_array: new UntypedFormArray([]),
      allowed_countries: new UntypedFormArray([]),
      allowed_cities: new UntypedFormArray([]),
    })
  }

  _patchForm(){
    this.subAdminForm.patchValue({
      username: this.editAdmin.username,
      email: this.editAdmin.email,
      update_admin_id: this.editAdmin._id,
      url_array: this.editAdmin.url_array,
      type: this.editAdmin.type,
      is_show_email : this.editAdmin.is_show_email,
      is_show_phone : this.editAdmin.is_show_phone,
      allowed_countries: this.editAdmin.allowed_countries,
      allowed_cities: this.editAdmin.allowed_cities,
      is_country_based_access_control_enabled: this.editAdmin.is_country_based_access_control_enabled,
      is_city_based_access_control_enabled: this.editAdmin.is_city_based_access_control_enabled,
    })
    this.subAdminForm.controls['password'].setValidators(null);
    this.subAdminForm.controls['password'].setErrors(null);
    this.subAdminForm.patchValue({
      _id:this.editAdmin._id
    })
    if(this.editAdmin.type === 1){
      this.is_sub_admin = true;
    } else {
      this.is_sub_admin = false;
    }
    this.adminUrls = this.editAdmin.url_array;
    this.selectedCountries = this.editAdmin.allowed_countries;
    this.getCityList();
    this.selectedCities = this.editAdmin.allowed_cities;

    this.country_list.forEach((country) => {
      this.selectedCountries.forEach((selected_country) => {
        if(country._id == selected_country){
          country.is_country_checked = true;
        }
      })
    })
  }

  onUrlCheck(value, event){
    if(this.all_permission_checked && this.adminUrls.length == this._subAdminUrl.url_array.length){
      this.all_permission_checked = false;
      this.all_permission_add_checked = false;
      this.all_permission_edit_checked = false;
      this.all_permission_delete_checked = false;
      this.all_permission_export_checked = false;
    }
    let url_to_check = this.admin_urls.filter(url => url.value == value);
    let index = url_to_check[0].index;
    let admin_url_index = this.admin_urls.findIndex((x) => x.index == index);
    if(event.target.checked){
      let route = this.admin_urls[admin_url_index]?.route ? this.admin_urls[admin_url_index]?.route : '';
      
      if(admin_url_index != -1){
        this.adminUrls.push({
          url: this.admin_urls[admin_url_index].value,
          permission: '10000',
          route: route
        })
      }
    } else {
      let urlIndex = this.adminUrls.findIndex(x => x.url === this.admin_urls[admin_url_index].value)
      this.adminUrls.splice(urlIndex, 1)
    }
  }

  is_checked(url, type){
    let index = this.adminUrls.findIndex((x)=>x.url==url);
    if(index!==-1){
      let permission = this.adminUrls[index].permission.split('');
      if(permission[Number(type)]=='1'){
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  change_permission(url, type){
    switch (Number(type)) {
      case this._helper.PERMISSION.ADD:
        if (this.all_permission_add_checked && this.adminUrls.length == this._subAdminUrl.url_array.length) {
          this.all_permission_add_checked = false;
        }
        break;
      case this._helper.PERMISSION.EDIT:
        if (this.all_permission_edit_checked && this.adminUrls.length == this._subAdminUrl.url_array.length) {
          this.all_permission_edit_checked = false;
        }
        break;
      case this._helper.PERMISSION.DELETE:
        if (this.all_permission_delete_checked && this.adminUrls.length == this._subAdminUrl.url_array.length) {
          this.all_permission_delete_checked = false;
        }
        break;
      case this._helper.PERMISSION.EXPORT:
        if (this.all_permission_export_checked && this.adminUrls.length == this._subAdminUrl.url_array.length) {
          this.all_permission_export_checked = false;
        }
        break;
    }
    let index = this.adminUrls.findIndex((x)=>x.url==url);
    if(index!==-1){
      let permission = this.adminUrls[index].permission.split('');
      if(permission[Number(type)]=='1'){
        permission[Number(type)] = '0';
      } else {
        permission[Number(type)] = '1';
      }
      this.adminUrls[index].permission = permission.join('')
    }
  }

  onAddAdmin(){
    if(this.name_error){
      document.getElementById('username')?.focus();
      return;
    }
    document.getElementById("scrollTop").scrollIntoView({
      behavior: 'smooth',
      block : 'end',
      inline: "nearest"  
    });

    this.subAdminForm.patchValue({
      username: this.subAdminForm.value.username?.toString().trim(),
      email: this.subAdminForm.value.email?.toString().trim(),
      password: this.subAdminForm.value.password?.toString().trim(),
    })
    
    this.subAdminForm.markAllAsTouched()

    if(this.subAdminForm.value.is_country_based_access_control_enabled && this.selectedCountries.length == 0){
      this.select_country_error = true;
    }else{
      this.select_country_error = false;
    }
    if(this.subAdminForm.value.is_city_based_access_control_enabled && this.selectedCities.length == 0){
      this.select_city_error = true;
    }else{
      this.select_city_error = false;
    }
    if((this.subAdminForm.value.is_country_based_access_control_enabled && this.selectedCountries.length == 0) || (this.subAdminForm.value.is_city_based_access_control_enabled && this.selectedCities.length == 0)){
      return
    }

    if(this.subAdminForm.valid){
      if(this.subAdminForm.value.is_country_based_access_control_enabled){
        this.subAdminForm.value.allowed_countries  = this.selectedCountries;
      }else{
        this.subAdminForm.value.allowed_countries  = [];
      }
      if(this.subAdminForm.value.is_city_based_access_control_enabled){
        this.subAdminForm.value.allowed_cities  = this.selectedCities;
      }else{
        this.subAdminForm.value.allowed_cities  = [];
      }
      if(this.subAdminForm.value.type == 1){
        if(this.adminUrls.length == 0){
          this._notifiyService.showNotification('error',this._helper.trans.instant("validation-title.please-select-atleast-one-permission"))
          return
        }
        this.subAdminForm.value.url_array = this.adminUrls;
        this._subAdminService.addNewAdmin(this.subAdminForm.value).then((res) => {
          if(res.success){
            this.add_update.emit();
          }
        });
        this.onClose();
      } else {
        this.subAdminForm.value.url_array  = [];
        this._subAdminService.addNewAdmin(this.subAdminForm.value).then((res) => {
          if(res.success){
            this.add_update.emit();
          }
        })
        this.onClose();
      }
    }
  }

  onUpdateAdmin(){
    if(this.name_error){
      document.getElementById('username')?.focus();
      return;
    }
    this.subAdminForm.markAllAsTouched();

    if(this.subAdminForm.value.is_country_based_access_control_enabled && this.selectedCountries.length == 0){
      this.select_country_error = true;
    }else{
      this.select_country_error = false;
    }
    if(this.subAdminForm.value.is_city_based_access_control_enabled && this.selectedCities.length == 0){
      this.select_city_error = true;
    }else{
      this.select_city_error = false;
    }
    if((this.subAdminForm.value.is_country_based_access_control_enabled && this.selectedCountries.length == 0) || (this.subAdminForm.value.is_city_based_access_control_enabled && this.selectedCities.length == 0)){
      return
    }

    if(this.subAdminForm.valid){
      if(this.subAdminForm.value.is_country_based_access_control_enabled  ){
        this.subAdminForm.value.allowed_countries  = this.selectedCountries;
      }else{
        this.subAdminForm.value.allowed_countries  = [];
      }
      if(this.subAdminForm.value.is_city_based_access_control_enabled){
        this.subAdminForm.value.allowed_cities  = this.selectedCities;
      }else{
        this.subAdminForm.value.allowed_cities  = [];
      }
      if(this.subAdminForm.value.type == 1){
        if(this.adminUrls.length == 0){
          this._notifiyService.showNotification('error', this._helper.trans.instant("validation-title.please-select-atleast-one-permission"))
          return
        }
        this.subAdminForm.value.url_array  = this.adminUrls;
      }else{
        this.subAdminForm.value.url_array  = [];
      }
      this._subAdminService.updateAdminDetails(this.subAdminForm.value).then((res) => {
        if(res.success){
          this.add_update.emit();
        }
      })
      this.onClose();
    }
  }

  onClose(){
    this.modalRef?.hide()
    setTimeout(() => {
      this.searchText = '';
      this.subAdminForm.reset();
      this.adminUrls.length = 0;
      this.isEdit = false;
      this.is_sub_admin = false;
      this.country_list = [];
      this.city_list = [];
      this.selectedCountries = [];
      this.selectedCities = [];
      this.select_country_error = false;
      this.select_city_error = false;
      this.all_permission_checked = false;
      this.all_permission_add_checked = false;
      this.all_permission_edit_checked = false;
      this.all_permission_delete_checked = false;
      this.all_permission_export_checked = false;
    }, 100);
  }

  onAdminType(event){
    this.adminUrls = [];
    if(event === 1){
      this.is_sub_admin = true
    } else {
      this.is_sub_admin = false
    }
  }

  adminUrlList(){
    this._subAdminService.adminUrlList().then((data) => {
      this.admin_urls = data.url_array;
    })
  }

   // get CountryList
  getCountryList() {
    this._countryService.fetchCountry().then(res => {
      if (res.success) {
        this.country_list = res.country_list;
        this.country_list.forEach((country) => {
          country.is_country_checked = false;
        })
      } else {
        this.country_list = []
      }
      this._initForm()
      if (this.editAdmin != '') {
        this.isEdit = true
        this.editAdmin.url_array = JSON.parse(JSON.stringify(this.editAdmin.url_array))
        this.subAdminForm.addControl('_id', new UntypedFormControl(null, Validators.required))
        this._patchForm();
      }
      this.modalRef = this.modalService.show(this.template, this.config);
    })
  }

  selectCountry(data) {
    if (data.is_country_checked) {
      this.selectedCountries.push(data._id);
      this.getCityList();
    } else {
      this.selectedCountries = this.selectedCountries.filter(item => item !== data._id);
      this.getCityList();
    }
  }

  // get CityList
  getCityList() {
    let json: any = { country_ids: this.selectedCountries };
    this._cityService.fetchDestinationCity(json).then(city => {
      if (city.success) {
        this.city_list = city.destination_list;
        this.city_list.forEach(city => {
          city.is_city_checked = false;
        })
        if(this.isEdit){
          this.city_list.forEach((city) => {
            this.selectedCities.forEach((selected_city) => {
              if(city._id == selected_city){
                city.is_city_checked = true;
              }
            })
          })
        }
        
        const citiesNotInList = this.selectedCities.filter(selected_city => !this.city_list.some(city => city._id == selected_city));
        if(citiesNotInList.length > 0){
          citiesNotInList.forEach(city => {
            if(this.selectedCities.includes(city)){
              this.selectedCities.splice(city,1);
            }
          })
        }
      }
    })
  }

  selectCity(data) {
    if (data.is_city_checked) {
      this.selectedCities.push(data._id);
    } else {
      this.selectedCities = this.selectedCities.filter(item => item !== data._id);
    }
  }

  changeCountryAccess(){
    if(!this.subAdminForm.value.is_country_based_access_control_enabled){
      this.subAdminForm.patchValue({is_city_based_access_control_enabled:false})
    }
  }

  changeCityAccess(){
    if(this.subAdminForm.value.is_city_based_access_control_enabled){
      this.subAdminForm.patchValue({is_country_based_access_control_enabled:true})
    }
  }

  onChangeAllTypePermissions(type) {
    this._subAdminUrl.url_array.forEach((url) => {
      switch (type) {
        case this._helper.PERMISSION.ADD:
          if ((+(url.actions[this._helper.PERMISSION.ADD]))) {
            this.change_permission(url.value, this._helper.PERMISSION.ADD);
          }
          break;
        case this._helper.PERMISSION.EDIT:
          if ((+(url.actions[this._helper.PERMISSION.EDIT]))) {
            this.change_permission(url.value, this._helper.PERMISSION.EDIT);
          }
          break;
        case this._helper.PERMISSION.DELETE:
          if ((+(url.actions[this._helper.PERMISSION.DELETE]))) {
            this.change_permission(url.value, this._helper.PERMISSION.DELETE);
          }
          break;
        case this._helper.PERMISSION.EXPORT:
          if ((+(url.actions[this._helper.PERMISSION.EXPORT]))) {
            this.change_permission(url.value, this._helper.PERMISSION.EXPORT);
          }
          break;
      }
    })
  }

  onAllPemissionChange(event){
    this.all_permission_checked = event.target.checked;
    if(event.target.checked && this.adminUrls.length == 0){
      this._subAdminUrl.url_array.forEach((url) => {
        let id = `${url.index}`
        document.getElementById(id).click();
      })
    }else{
      const differenceArray = this._subAdminUrl.url_array.filter(item2 => !this.adminUrls.some(item1 => item1.url === item2.value));
      differenceArray.forEach((value) => {
        let id = `${value.index}`
        document.getElementById(id).click();
      })
      this._subAdminUrl.url_array.forEach((url) => {
        let id = `${url.index}`
        document.getElementById(id).click();
      })
      if(event.target.checked){
        this._subAdminUrl.url_array.forEach((url) => {
          let id = `${url.index}`
          document.getElementById(id).click();
        })
      }
    }
    if(!event.target.checked){
      this.all_permission_add_checked = false;
      this.all_permission_edit_checked = false;
      this.all_permission_delete_checked = false;
      this.all_permission_export_checked = false;
    }
  }

  onAllTypePemissionChange(event, type) {
    switch (type) {
      case this._helper.PERMISSION.ADD:
        this.all_permission_add_checked = event.target.checked;
        this._subAdminUrl.url_array.forEach((url) => {
          if (+url.actions[this._helper.PERMISSION.ADD]) {
            let admin_permission = this.adminUrls.find(x => x.url == url.value);
            let permission = admin_permission.permission.split('');
            if (event.target.checked && permission[Number(this._helper.PERMISSION.ADD)] == '0') {
              this.change_permission(url.value, this._helper.PERMISSION.ADD)
              this.is_checked(url.value, this._helper.PERMISSION.ADD)
            }
            if (!event.target.checked && permission[Number(this._helper.PERMISSION.ADD)] == '1') {
              this.change_permission(url.value, this._helper.PERMISSION.ADD)
              this.is_checked(url.value, this._helper.PERMISSION.ADD)
            }
          }
        })
        break;
      case this._helper.PERMISSION.EDIT:
        this.all_permission_edit_checked = event.target.checked;
        this._subAdminUrl.url_array.forEach((url) => {
          if (+url.actions[this._helper.PERMISSION.EDIT]) {
            let admin_permission = this.adminUrls.find(x => x.url == url.value);
            let permission = admin_permission.permission.split('');
            if (event.target.checked && permission[Number(this._helper.PERMISSION.EDIT)] == '0') {
              this.change_permission(url.value, this._helper.PERMISSION.EDIT)
              this.is_checked(url.value, this._helper.PERMISSION.EDIT)
            }
            if (!event.target.checked && permission[Number(this._helper.PERMISSION.EDIT)] == '1') {
              this.change_permission(url.value, this._helper.PERMISSION.EDIT)
              this.is_checked(url.value, this._helper.PERMISSION.EDIT)
            }
          }
        })
        break;
      case this._helper.PERMISSION.DELETE:
        this.all_permission_delete_checked = event.target.checked;
        this._subAdminUrl.url_array.forEach((url) => {
          if (+url.actions[this._helper.PERMISSION.DELETE]) {
            let admin_permission = this.adminUrls.find(x => x.url == url.value);
            let permission = admin_permission.permission.split('');
            if (event.target.checked && permission[Number(this._helper.PERMISSION.DELETE)] == '0') {
              this.change_permission(url.value, this._helper.PERMISSION.DELETE)
              this.is_checked(url.value, this._helper.PERMISSION.DELETE)
            }
            if (!event.target.checked && permission[Number(this._helper.PERMISSION.DELETE)] == '1') {
              this.change_permission(url.value, this._helper.PERMISSION.DELETE)
              this.is_checked(url.value, this._helper.PERMISSION.DELETE)
            }
          }
        })
        break;
      case this._helper.PERMISSION.EXPORT:
        this.all_permission_export_checked = event.target.checked;
        this._subAdminUrl.url_array.forEach((url) => {
          if (+url.actions[this._helper.PERMISSION.EXPORT]) {
            let admin_permission = this.adminUrls.find(x => x.url == url.value);
            let permission = admin_permission.permission.split('');
            if (event.target.checked && permission[Number(this._helper.PERMISSION.EXPORT)] == '0') {
              this.change_permission(url.value, this._helper.PERMISSION.EXPORT)
              this.is_checked(url.value, this._helper.PERMISSION.EXPORT)
            }
            if (!event.target.checked && permission[Number(this._helper.PERMISSION.EXPORT)] == '1') {
              this.change_permission(url.value, this._helper.PERMISSION.EXPORT)
              this.is_checked(url.value, this._helper.PERMISSION.EXPORT)
            }
          }
        })
        break;
    }
  }

  checkCharacterLimitvalidation(value) {
    this.name_error = this._helper.validateAndUpdateError(value, this._helper.maximum_full_name_character_limit);
  }

}
