import { CommonService } from 'src/app/services/common.service';
import { DriverService, user_active_type } from '../../../../services/driver.service';
import { Helper } from '../../../../shared/helper';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EditDriverModalComponent } from 'src/app/containers/pages/edit-driver-modal/edit-driver-modal.component';
import { user_page_type } from 'src/app/services/driver.service';
import { Subscription } from 'rxjs';
import { PANEL_TYPE } from '../../../../constants/constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ServiceTypeService } from 'src/app/services/service-type.service';
import { NotifiyService } from 'src/app/services/notifier.service';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { AddDriverModalComponent } from 'src/app/containers/pages/add-driver-modal/add-driver-modal.component';
import { CityService } from 'src/app/services/city.service';
import { CountryService } from 'src/app/services/country.service';
import { SocketService } from 'src/app/services/sockert.service';
import { WsalResponseModalComponent } from 'src/app/containers/pages/wsal-response-modal/wsal-response-modal.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss']
})
export class DriverComponent implements OnInit {
  darkTheme = localStorage.getItem('vien-themecolor');
  unfreezeModelRef:BsModalRef;
  confirmModelRef: BsModalRef;
  declineModelRef: BsModalRef;
  confirmationModalConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  itemOrder = { label: 'label-title.id', value: 'unique_id' };
  itemOptionsOrders = [
    { label: 'label-title.id', value: 'unique_id' , isShow : true},
    { label: 'label-title.name', value: 'first_name' , isShow : true },
    { label: 'label-title.email', value: 'email' , isShow : true},
    { label: 'label-title.city', value: 'city' , isShow : true },
    { label: 'label-title.phone', value: 'phone' , isShow : true },
    { label: 'label-title.country', value: 'country' , isShow : true },
  ];
  OptionDriverType = {label: 'label-title.all', value: 'all'}
  driverTypeOption = [
    { label: 'label-title.all', value: 'all' , isShow : true},
    { label: 'label-title.normal', value: '0' , isShow : true },
    { label: 'label-title.partner', value: '1' , isShow : true},
    { label: 'label-title.admin', value: '2' , isShow : true }
  ];
  displayOptionsCollapsed = false;
  queue_socket:any;
  viewType: number = 1;
  is_approveDriver: number;
  driver_list: any[] = [];
  queue_driver_list: any[] = [];
  filterData = { type: '', page_no: 1, item_per_page: 15 };
  currentPage:number = 1;
  userList: any;
  user_page_type: any = user_page_type;
  user_active_type: any = user_active_type;
  count: any;
  status: any = user_page_type.approved;
  active: any = user_active_type.active;
  search_value: any = '';
  searchBy: any = this.itemOrder.value;
  driverType: any = this.OptionDriverType.value;
  assignVehicleData: any;
  vehicleType: any;
  selectedDriver: any;
  approvalStatus: any;
  header : any ;
  driver_id: string;
  selected_vehicle: string = '';
  selected_serviceType: string = '';
  selected_type: number;
  darkMode:boolean=false;
  isFilterApply : boolean = false ;
  selectedId: string = '';
  partnerData : any = {} ;
  is_zone_queue = false;
  country_list: any = [];
  city_list: any = [];
  city_zone_list: any = [];
  country:any = null;
  city:any = null;
  zone:any = null;
  selected_zone_id:string;
  is_clear_filter_disabled:boolean = true;
  userObservable: Subscription;
  notificationObservable: Subscription;
  tabType:number;
  itemsPerPage = 15;
  itemOptionsPerPage = [];
  timezone_for_display_date: string = '';
  all_checkbox_selected: boolean = false;
  selected_driver_ids: string[] = [];
  wsal_status_socket:any;
  buttonState = '';
  buttonDisabled = false;
  is_wsal_status = false;
  driverRentVehicleList: any;
  selected_rent_vehicle_id:any;
  selected_rent_vehicle_detail:any;
  is_rental_vehicle_approved:boolean = false;
  is_use_wsal_service:boolean = false;


  @ViewChild('search') search: any;
  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;
  @ViewChild('approveTemplate', { static: true }) approveTemplate: TemplateRef<any>;
  @ViewChild('declineTemplate', { static: true }) declineTemplate: TemplateRef<any>;
  @ViewChild('unfreezeTemplate', { static: true }) unfreezeTemplate: TemplateRef<any>;
  @ViewChild('DriverUserModal', { static: true }) DriverUserModal: EditDriverModalComponent;
  @ViewChild('addNewDriverModal', { static: true }) addNewDriverModal: AddDriverModalComponent;
  @ViewChild('wsalResponseModal', { static: true }) wsalResponseModal: WsalResponseModalComponent;

  constructor(private _notifierService: NotifiyService,private _socket:SocketService,private _countryService:CountryService,private _cityService:CityService, private serviceType: ServiceTypeService, private modalService: BsModalService, private _helper: Helper, private _driverService: DriverService, private _commonService: CommonService, private userservice: UserService,) { }

  ngOnInit(): void {
    this.is_use_wsal_service = this._helper?.admin_setting_details?.is_wsal_service_use;    
    this.itemOptionsPerPage = this._helper.USERS_PER_PAGE_LIST;
    this.filterData['type'] = PANEL_TYPE.PROVIDER;
    this.filterData['driver_type'] = this.driverType;
    this.filterData['is_approved'] = this.status;
    this.filterData['search_item'] = this.searchBy;
    this.filterData['is_active'] = this.active;

    this.notificationObservable = this._helper.notification_detail.subscribe(notification =>{
      if(!this.is_zone_queue){
        if(notification){
          setTimeout(() => {
            this.selectTab(2)
            this.redirect_from_notification(notification.user_unique_id)
            this.showDriverModal(null, notification.user_id)
          }, 100);
        }else{
          if (this._helper.selected_id == '') {
            this.userObservable = this._commonService._userObservable.subscribe(() => {
              this.getProviderFilterList(this.filterData);
            })
          }
          if (this._helper.selected_id) {
            this.selectedId = this._helper.selected_id;
            this.partnerData = JSON.parse(localStorage.getItem('historyData'));
            this.filterData['partner_id'] = this._helper.selected_id;
            this.userObservable = this._commonService._userObservable.subscribe(() => {
              this.getProviderFilterList(this.filterData);
            })
          }
        }
      }
    })
    console.log(this._helper.admin_setting_details);
    
    this._helper.display_date_timezone.subscribe(data => {
      this.timezone_for_display_date = data;
    })

    if(this.darkTheme.startsWith('dark')){
      this.darkMode=true;
    }
  }

  selectTab(tabId: number) {
    this.tabType =tabId;
    if (this.staticTabs?.tabs[tabId]) {
      this.staticTabs.tabs[tabId].active = true;
    }
  }

  redirect_from_notification(unique_id): void {
    this.searchBy = "unique_id"
    this.search_value = unique_id
    this.filterData['is_approved'] = user_page_type.blocked;
    this.apply(this.search_value)
  }

  // Proverder List Get
  getProviderFilterList(filterData) {
    this._commonService.getAdminTypeList(filterData).then((res_data: any) => {
      this.driver_list = res_data.type_list;
      this.driver_list.forEach(driver => {
        let selected_vehicle = driver.vehicle_detail.find(vehicle => vehicle.is_selected);
        if(!selected_vehicle){
          selected_vehicle = driver.vehicle_detail[0]
        }
        driver.selected_vehicle = selected_vehicle;
      });
      this.count = res_data.total_page;
      setTimeout(() => {
        if(this.driver_list.length == 0 && this.filterData['page_no'] != 1){
          this.filterData['page_no'] = 1;
          this.pageChanged(1);
        }
      }, 500);
      this.itemOptionsOrders.forEach((data) => {
        if(data.value == 'email' && res_data.is_show_email === false){
          data.isShow = false ;
        }
        if(data.value == 'phone' && res_data.is_show_phone === false){
          data.isShow = false ;
        }
      })
    })
  }

  // Provider Type Change to Active , approve and Active ;
  changeDriverType(status, active) {
    this.is_zone_queue = false;
    this.currentPage = 1;
    this.all_checkbox_selected = false;
    this.selected_driver_ids = [];
    this.filterData['page_no'] = 1;
    this.status = status == user_page_type.approved ? 1 : 0;
    this.active = active == user_active_type.active ? 1 : 0;
    this.filterData['is_approved'] = this.status;
    this.filterData['is_active'] = this.active;
    if(this.status == 2 && this.active == 2){
      this.is_wsal_status = true;
    } else {
      this.is_wsal_status = false;
    }
    this.getProviderFilterList(this.filterData);
  }

  getCountryList() {
    this._countryService.fetchCountry().then(res => {
      if (res.success) {
        this.country_list = res.country_list;
      } else {
        this.country_list = [];
      }
    })
  }

  // get city from country
  getCityList(country_Id) {
    this.city = null;
    this.zone = null;
    this.city_list = [];
    this.city_zone_list = [];
    this.is_clear_filter_disabled = false;
    this.country = country_Id;
    this._cityService.fetchDestinationCity({ country_id: country_Id, type:1  }).then(res => {
      if (res.success) {
        this.city_list = res.destination_list;
      } else {
        this.city_list = [];
      }
    })
  }

  //get cityzone from city
  getCityZoneList(cityId){
    this.zone = null;
    this.city_zone_list = [];
    this.is_clear_filter_disabled = false;
    this.city = cityId;
    this._cityService.fetch_cityzone({ cityid: cityId }).then(res => {
      if (res.success) {
        this.city_zone_list = res.cityzone_details;
      } else {
        this.city_zone_list = [];
      }
    })
  }

  //get zone provider id
  getZoneProviderId(id){
    this.is_clear_filter_disabled = false;
    this.selected_zone_id = id;
    this.queueApply();
  }

  //get zone provider list
  getZoneProviderList(id){
    this.is_clear_filter_disabled = false;
    let json:any = {zone_id : id};
    this._driverService.getZoneProviderList(json).then((response) => {
      if(response?.success){
        this.queue_driver_list = response.zone_providers;
        if(this.queue_socket){
          this.queue_socket.unsubscribe();
        }
        this.queue_socket = this._socket.listener("'" + id + "'").subscribe(() => {
            this.getZoneProviderList(id);
        })
      }
    })
  }

  queueApply(){
    if(this.selected_zone_id){
      this.getZoneProviderList(this.selected_zone_id);
    }
  }

  queueClear(){
    this.selected_zone_id = null;
    this.country = null;
    this.city = null;
    this.zone = null;
    this.city_list = [];
    this.queue_driver_list = [];
    this.city_zone_list = [];
    this.is_clear_filter_disabled = true;
  }

  queueDriver(){
    this.is_zone_queue = true;
    this.currentPage = 1;
    this.filterData['page_no'] = 1;
    this.getCountryList();
  }

  // Edit Driver Model open
  showDriverModal(event,driver_id): void {
    if(!event || event.target.tagName.toLowerCase() !== 'button'){
    this.DriverUserModal.show(driver_id, this.filterData.type, this.status, false);
    }
  }

  onChangeType(item):void{
    this.isFilterApply = true;
    this.OptionDriverType = item
    this.filterData['driver_type'] = this.OptionDriverType.value;
  }

  // Item Per Page In view
  onChangeItemsPerPage(item): void {
    this.itemsPerPage = item;
    this.filterData['item_per_page'] = item;
    if(this.count >= this.currentPage){
      this.currentPage = 1;
      this.filterData['page_no'] = 1;
    }
    this.getProviderFilterList(this.filterData);
  }

  // Search Item Filter
  onChangeOrderBy(user): void {
    this.isFilterApply = true;
    this.itemOrder = user;
    this.filterData['search_item'] = this.itemOrder.value;
  }

  // View Change By Grid View to List and wise versa
  onViewChange(type) {
    this.viewType = type
  }

  //  Pagination
  pageChanged(event) {
    this.all_checkbox_selected = false;
    this.selected_driver_ids = [];
    this.currentPage = event;
    this.filterData['page_no'] = event;
    this.getProviderFilterList(this.filterData);
  }

  // Apply Filter
  apply(value) {
    this.currentPage = 1;
    this.search_value = value;
    this.filterData['search_value'] = this.search_value;
    this.filterData['page_no'] = 1;
    this.getProviderFilterList(this.filterData);
    this.isFilterApply = true ;
  }

  // Clear Fliter
  clear() {
    this.currentPage = 1;
    this.filterData['page_no'] = 1;
    this.search_value = ''
    this.filterData['search_value'] = '';
    this.filterData['search_item'] = this.searchBy;
    this.filterData['driver_type'] = this.driverType
    this.OptionDriverType = {label: 'label-title.all', value: 'all'}
    this.itemOrder = { label: 'label-title.id', value: 'unique_id' };
    this.getProviderFilterList(this.filterData);
    this.isFilterApply = false ;
  }

  //  Decline Driver modal
  approveDecline(driver, status) {
    this.selectedDriver = driver;
    this.driver_id = driver._id;
    this.approvalStatus = status;
    this.declineModelRef = this.modalService.show(this.declineTemplate, this.confirmationModalConfig);
  }

  async decline() {
    let res_data:any = await this._commonService.getAdminTypeList(this.filterData);
    this.driver_list = res_data.type_list;
    this.count = res_data.total_page;

    let updated_driver = res_data.type_list.filter(x => x._id == this.driver_id)
    if(updated_driver?.length > 0){
      this.selectedDriver = updated_driver[0];
    }

    let json: any;
    if (this.approvalStatus == 1) {
      json = { is_document_uploaded: this.selectedDriver.is_document_uploaded,
         id: this.selectedDriver._id,
         is_approved: this.is_approveDriver,
         service_type: this.selectedDriver.service_type,
         vehicle_id: this.selectedDriver.vehicle_detail?.length > 0 ? this.selectedDriver.vehicle_detail[0]._id : null,
         type: this.filterData.type,
         provider_type: this.selectedDriver.provider_type }

      this.selectedDriver?.vehicle_detail?.forEach(vehicle => {
        if (vehicle.is_selected === true) {
          json.vehicle_id = vehicle._id
        }
      })
    } else {
      json = {
        is_approved: this.approvalStatus.toString(),
        id: this.driver_id,
        type: this.filterData.type
      }
    }
    this._commonService.approveDriver(json).then(() => {
      this.userObservable = this._commonService._userObservable.subscribe(() => {
      this.getProviderFilterList(this.filterData);
        this.declineModelRef?.hide();
      })
    })
  }

  async declineRental() {
    let json = {
      provider_id: this.driver_id,
      is_approved: this.approvalStatus.toString()
    }
    this._commonService.approveRentalDriver(json).then(() => {
      this.declineModelRef?.hide();
    })
  }

  cancelDeclineModal() {
    this.declineModelRef?.hide();
  }

  // open approve driver modal
  async openModalTypeSelect(driver, status) {
    this.is_approveDriver = status;
    this.assignVehicleData = driver;
    
    let res_data : any = await this._commonService.fetchUpdateData({_id : driver._id , type : "2"} )
    if (res_data.type_detail) {
      this.assignVehicleData.vehicle_detail = res_data.type_detail[0].vehicle_detail
    }
    if (this.assignVehicleData.vehicle_detail?.length > 0) {
      this.selected_vehicle = this.assignVehicleData.vehicle_detail[0]._id
    }
    if ((driver.admintypeid == null) && (driver.service_type == null) && (driver.provider_type != 2)) {
      this.selected_type = this._helper.DRIVER_APPROVE_TYPE.NORMAL;
      this.confirmModelRef = this.modalService.show(this.approveTemplate, this.confirmationModalConfig);
      this.getServiceTypeList();
    } else {
      this.selectedDriver = driver;
      this.driver_id = driver._id;
      this.approvalStatus = status;
      this.declineModelRef = this.modalService.show(this.declineTemplate, this.confirmationModalConfig);
      this.selected_vehicle = '';
      this.selected_serviceType = '';
      this.selected_type = null;
    }
  }

  // service type list
  getServiceTypeList() {
    let json: any = { provider_id: this.assignVehicleData._id, type: this.filterData.type };
    this.serviceType.fetchServiceTypeList(json).then((res_data) => {
      this.vehicleType = res_data.service_list;
      if (res_data.service_list.length > 0) {
        this.selected_serviceType = res_data.service_list[0]._id;
      }
    })
  }

  cancel() {
    setTimeout(() => {
      this.selected_vehicle = '';
      this.selected_serviceType = '';
      this.selected_type = null;
      this.assignVehicleData = null;
    }, 500);
    this.confirmModelRef?.hide()
  }

  // approve driver modal
  approveDriver(driver) {
    let provider_type = this.selected_type;
    if(this.selected_type == this._helper.DRIVER_APPROVE_TYPE.NORMAL){
      if(this.assignVehicleData.provider_type == this._helper.DRIVER_APPROVE_TYPE.PARTNER){
        provider_type = this._helper.DRIVER_APPROVE_TYPE.PARTNER;
      }
    }
    let json: any = { is_document_uploaded: driver.is_document_uploaded, id: driver._id, is_approved: this.is_approveDriver, service_type: this.selected_serviceType, vehicle_id: this.selected_vehicle, type: this.filterData.type,provider_type: provider_type }
    this._commonService.approveDriver(json).then(() => {
      this.cancel();
    })
  }

  // unfreeze driver
  unfreeze(id) {
    let json: any = { provider_id: id }
    this._driverService.providerUnfreeze(json).then((res:any) => {
      this.closeUnfreezeModel();
      if(res.success){
        let index = this.driver_list.findIndex((ele)=> ele._id == id)
        if(index != -1){
          this.driver_list[index] = res.provider_detail
        }
      }
    })
  }

  // open unfreeze model
  openUnfreezeModel(driver){
    this.selectedDriver = driver;
    this.unfreezeModelRef = this.modalService.show(this.unfreezeTemplate, this.confirmationModalConfig);
  }

  closeUnfreezeModel() {
    setTimeout(() => {
      this.selectedDriver = null;
    }, 500);
    this.unfreezeModelRef.hide()
  }

  ngOnDestroy() {
    if(this.userObservable){
      this.userObservable.unsubscribe();
    }
    this.notificationObservable.unsubscribe();
    this._helper.selected_id = '';
    this.search_value = '';
    this.filterData['search_value'] = '' ;
    this._helper.notification.next(null);
  }

  export() {
    if (this.driver_list.length > 0) {
      let header = {
        id : this._helper.trans.instant('label-title.id'),
        name : this._helper.trans.instant('heading-title.name'),
        email : this._helper.trans.instant('user.email'),
        phone : this._helper.trans.instant('heading-title.phone'),
        country : this._helper.trans.instant('menu.country'),
        type: this._helper.trans.instant('heading-title.type'),
      }

      this.header = JSON.stringify(header);
      this.filterData['header'] = this.header
      this.filterData['is_excel_sheet'] = true;
      this._commonService.getAdminTypeList(this.filterData).then((res: any) => {
        this._helper.downloadFile(res.url);
        this.filterData['is_excel_sheet'] = null;
        this.header = ''
      });
    } else {
      this._notifierService.showNotification('error', this._helper.trans.instant('label-title.no-record-found'));
    }
  }

  addNewDriver(){
    this.addNewDriverModal.show();
  }

  showWsalResponse(data){
    this.wsalResponseModal.show(data);
  }

  onCheckboxChange(event, selected_id){
    if (event.target.checked){
      if(selected_id == 'All'){
        this.all_checkbox_selected = true;
        this.driver_list.forEach((driver)=>{
          if (!this.selected_driver_ids.includes(driver._id)) {
            this.selected_driver_ids.push(driver._id);
          }
        })
      }else{
        if (!this.selected_driver_ids.includes(selected_id)) {
          this.selected_driver_ids.push(selected_id);
        }
      }
    } else {
      if (selected_id === 'All') {
        this.all_checkbox_selected = false;
        this.selected_driver_ids = [];
      } else {
        this.selected_driver_ids = this.selected_driver_ids.filter(id => id !== selected_id);
      }
    }    
  }

  checkWsalStatus(){
    if(this.selected_driver_ids.length <= 0){
      this._notifierService.showNotification('error', this._helper.trans.instant('validation-title.please-select-driver'));
    } else {
      this._driverService.checkWsalStatus({ driver_ids: this.selected_driver_ids }).then(res => {
        if(res.success){
          this.getProviderFilterList(this.filterData);
          this.buttonDisabled = true;
          this.buttonState = 'show-spinner';
          this.all_checkbox_selected = false;
          this.selected_driver_ids = [];
          if(this.wsal_status_socket){
            this.wsal_status_socket.unsubscribe();
          }
          this.wsal_status_socket = this._socket.listener("wsal_scocket").subscribe(() => {
            this.getProviderFilterList(this.filterData);
            this.buttonDisabled = false;
            this.buttonState = '';
          })
        }
      })
    }
  }

}
