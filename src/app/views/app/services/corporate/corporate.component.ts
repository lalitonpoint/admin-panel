import { NotifiyService } from './../../../../services/notifier.service';
import { Subscription } from 'rxjs';
import { Helper } from 'src/app/shared/helper';
import { CommonService, user_page_type } from 'src/app/services/common.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CorporateModalComponent } from 'src/app/containers/pages/corporate-modal/corporate-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-corporate',
  templateUrl: './corporate.component.html',
  styleUrls: ['./corporate.component.scss']
})
export class CorporateComponent implements OnInit {
  darkTheme = localStorage.getItem('vien-themecolor');
  approveModalConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  approveModelRef: BsModalRef;
  itemUsers = [
    { label: 'Name', value: 'Name' },
    { label: 'Email', value: 'email' },
    { label: 'Country ', value: 'country_name' },
  ];
  itemOrder = { label: 'label-title.id', value: 'unique_id' };
  itemUser = { label: 'Name', value: 'Name' };
  itemDriection = { label: 'Ascending', value: 'ascending' };
  itemOptionsOrders = [
    { label: 'label-title.id', value: 'unique_id', isShow: true },
    { label: 'label-title.name', value: 'name', isShow: true },
    { label: 'label-title.email', value: 'email', isShow: true },
    { label: 'label-title.phone', value: 'phone', isShow: true },
    { label: 'label-title.country', value: 'country_name', isShow: true },
  ];
  filterData = { type: '', page_no: 1, item_per_page: 15 };
  userObservable: Subscription;
  approveDetail = {};
  data: any;
  corporate_list: any = [];
  search_value: any = '';
  searchBy: any = this.itemOrder.value;
  selectedCorporate: any;
  corporateId: any;
  approvalStatus: any;
  header: any;
  itemsPerPage = 15;
  count: number;
  viewType: number = 1;
  currentPage: number = 1;
  user_page_type: any = user_page_type;
  status: any = user_page_type.approved;
  darkMode: boolean = false;
  isFilterApply: boolean = false;
  notificationObservable: Subscription;
  tabType: number;
  itemOptionsPerPage = [];

  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;
  @ViewChild('approveTemplate', { static: true }) approveTemplate: TemplateRef<any>;
  @ViewChild('corporateSettingModal', { static: true }) corporateSettingModal: CorporateModalComponent;

  constructor(private _commonService: CommonService, public _helper: Helper, private modalService: BsModalService, private _notifierService: NotifiyService) { }

  ngOnInit(): void {
    this.itemOptionsPerPage = this._helper.USERS_PER_PAGE_LIST;
    this.filterData['type'] = this._helper.PANEL_TYPE.CORPORATE;
    this.filterData['search_item'] = this.searchBy;
    this.filterData['is_approved'] = this.status;

    this.notificationObservable = this._helper.notification_detail.subscribe(notification => {
      if(notification){
        setTimeout(() => {
          this.selectTab(1)
          this.redirect_from_notification(notification.user_unique_id)
          this.showCorporateSettingModal(notification.user_id)
        }, 100);
      }else{
        this.userObservable = this._commonService._userObservable.subscribe(() => {
          this.getCorporateFilterData(this.filterData)
        })
      }
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

  showCorporateSettingModal(id): void{
    this.corporateSettingModal.show(id , this.filterData.type , this.status);
  }

  // Filter By Search Item
  onChangeOrderBy(user): void  {
    this.isFilterApply = true;
    this.itemOrder = user;
    this.searchBy = user.value ;
    this.filterData['search_item'] = this.searchBy;
  }

  // Items Per Page View
  onChangeItemsPerPage(item): void  {
    this.itemsPerPage = item ;
    this.filterData['item_per_page']  = this.itemsPerPage ;
    if(this.count >= this.currentPage){
      this.currentPage = 1;
      this.filterData['page_no'] = 1;
    }
    this.getCorporateFilterData(this.filterData)
  }

  // Change Type of view By Grid to List View Or Wise versa
  onViewChange(type) {
    this.viewType = type
  }

  // Corporate Data List
  getCorporateFilterData(filterData){
    this._commonService.getAdminTypeList(filterData).then((res_data : any)=>{
      this.corporate_list = res_data.type_list ;
      this.count = res_data.total_page;
      setTimeout(() => {
        if(this.corporate_list.length == 0 && this.filterData['page_no'] != 1){
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

  // Filter Apply
  apply(search_value){
    this.currentPage = 1;
    this.filterData['page_no'] = 1;
    this.filterData['search_value'] = search_value ;
    if(this.search_value != ''){
      this.getCorporateFilterData(this.filterData);
      this.isFilterApply = true ;
    }
  }

  // Clear filter
  clear(){
    this.currentPage = 1;
    this.filterData['page_no'] = 1;
    this.search_value = ''
    this.filterData['search_value'] = '' ;
    this.itemOrder = { label: 'label-title.id', value: 'unique_id' } ;
    this.filterData['search_item'] = this.itemOrder.value ;
    this.getCorporateFilterData(this.filterData);
    this.isFilterApply = false ;
  }

  // Pagination
  pageChanged(event){
    this.currentPage = event;
    this.filterData['page_no']  = event;
    this.getCorporateFilterData(this.filterData)
  }

  changeUserType(status) {
    this.currentPage = 1;
    this.filterData['page_no'] = 1;
    this.status = status == user_page_type.approved ? 1 : 0;
    this.filterData['is_approved'] = this.status;
    this.getCorporateFilterData(this.filterData);
  }

  approveDeclineCorporate(status , corporate){
    this.selectedCorporate = corporate ;
    this.corporateId = corporate._id ;
    this.approvalStatus = status ;
    this.approveModelRef = this.modalService.show(this.approveTemplate, this.approveModalConfig);
  }

  approve(){
    let json = {
      is_approved : this.approvalStatus.toString() ,
      update_id : this.corporateId ,
      type : this.filterData.type
    }

    this._commonService.updateItemByType(json).then(()=>{
      this.approveModelRef.hide();
    })
  }

  cancel(){
    this.approveModelRef.hide();
  }

  export(){
    if(this.corporate_list.length != 0){
      let header = {
        id : this._helper.trans.instant('label-title.id'),
        name : this._helper.trans.instant('heading-title.name'),
        email : this._helper.trans.instant('user.email'),
        phone : this._helper.trans.instant('heading-title.phone'),
        country : this._helper.trans.instant('menu.country'),
      }

      this.header = JSON.stringify(header);
      this.filterData['header'] = this.header
      this.filterData['is_excel_sheet'] = true ;
      this._commonService.getAdminTypeList(this.filterData).then((res : any) => {
        this._helper.downloadFile(res.url);
        this.filterData['is_excel_sheet'] = null ;
        this.header = '';
      });
    }else{
      this._notifierService.showNotification('error', this._helper.trans.instant('label-title.no-record-found'));
    }
  }

  ngOnDestroy(){
    if(this.userObservable){
      this.userObservable.unsubscribe();
    }
    this.notificationObservable.unsubscribe();
    this.search_value = '';
    this.filterData['search_value'] = '' ;
    this._helper.notification.next(null);
  }

}
