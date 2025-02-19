import { PANEL_TYPE } from './../../../../constants/constants';
import { NotifiyService } from './../../../../services/notifier.service';
import { Subscription } from 'rxjs';
import { Helper } from 'src/app/shared/helper';
import { CommonService } from 'src/app/services/common.service';
import { DispatcherService } from './../../../../services/dispatcher.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AddDispatcherModelComponent } from 'src/app/containers/pages/add-dispatcher-model/add-dispatcher-model.component';
import { EditDispatcherModalComponent } from 'src/app/containers/pages/edit-dispatcher-modal/edit-dispatcher-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-dispatcher',
  templateUrl: './dispatcher.component.html',
  styleUrls: ['./dispatcher.component.scss']
})
export class DispatcherComponent implements OnInit {
  darkTheme = localStorage.getItem('vien-themecolor');
  itemOrder = { label: 'label-title.id', value: 'unique_id' }
  itemOptionsOrders = [
    { label: 'label-title.id', value: 'unique_id' , isShow : true },
    { label: 'label-title.name', value: 'first_name' , isShow : true },
    { label: 'label-title.email', value: 'email' , isShow : true },
    { label: 'label-title.phone', value: 'phone' , isShow : true},
    { label: 'label-title.country', value: 'country' , isShow : true},
   ];
   confirmationModalConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  userObservable: Subscription;
  dispatcherObservable : Subscription ;
  filterData = { type : '' , page_no : 1 , item_per_page : 15 };
  search_value : any = '';
  header : any ;
  searchBy : any = this.itemOrder.value ;
  list_data : any = [] ;
  PANEL_TYPE = PANEL_TYPE;
  dispatcher : any ;
  data: any;
  count : number ;
  viewType: number = 1;
  currentPage:number = 1;
  displayOptionsCollapsed = false;
  deleteById = {};
  confirmModelRef: BsModalRef;
  darkMode:boolean=false;
  isFilterApply : boolean = false ;
  itemsPerPage = 15;
  itemOptionsPerPage = [];

  @ViewChild('search') search: any;
  @ViewChild('confirmationTemplate', { static: true }) confirmationTemplate: TemplateRef<any>;
  @ViewChild('dispatcherListModel', { static: true }) dispatcherListModel: AddDispatcherModelComponent;
  @ViewChild('dispatcherSettingModel', { static: true }) dispatcherSettingModel: EditDispatcherModalComponent;

  constructor(private _dispatchService: DispatcherService, private _commonService: CommonService, private modalService: BsModalService, public _helper: Helper, private _notifierService: NotifiyService) { }

  ngOnInit(): void {
    this.itemOptionsPerPage = this._helper.USERS_PER_PAGE_LIST;
    this.filterData.type = this.PANEL_TYPE.DISPATCHER ;
    this.filterData['search_item'] = this.searchBy;
    this.userObservable = this._commonService._userObservable.subscribe(() => {
      this.filterList(this.filterData);
    })
    this.dispatcherObservable = this._dispatchService._dispatcherObservable.subscribe(() => {
      this.filterList(this.filterData);
    })

    if(this.darkTheme.startsWith('dark')){
      this.darkMode=true;
    }
  }

  onChangeOrderBy(user): void  {
    this.isFilterApply = true;
    this.itemOrder = user;
    this.searchBy = user.value ;
    this.filterData['search_item'] = this.searchBy;
  }

  showDispatcherListModel(): void{
    this.dispatcherListModel.show(this.filterData.type);
  }

  showDispatcherSettingModal(data): void{
    this.dispatcherSettingModel.show(data , this.filterData.type);
  }

  onViewChange(type) {
    this.viewType = type
  }

  onChangeItemsPerPage(item): void  {
    this.itemsPerPage = item ;
    this.filterData['item_per_page']  = this.itemsPerPage ;
    if(this.count >= this.currentPage){
      this.currentPage = 1;
      this.filterData['page_no'] = 1;
    }
    this.filterList(this.filterData)
  }

  pageChanged(event){
    this.currentPage = event;
    this.filterData['page_no']  = event;
    this.filterList(this.filterData)
  }

  filterList(filterData){
    this._commonService.getAdminTypeList(filterData).then((res_data : any)=>{
      this.list_data = res_data.type_list;
      this.count = res_data.total_page;
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

  apply(search_value){
    this.currentPage = 1;
    this.filterData['page_no'] = 1;
    this.filterData['search_value'] = search_value ;
    if(this.search_value != ''){
      this.filterList(this.filterData);
      this.isFilterApply = true ;
    }
  }

  clear(){
    this.currentPage = 1;
    this.filterData['page_no'] = 1;
    this.search_value = ''
    this.itemOrder = { label: 'label-title.id', value: 'unique_id' }
    this.filterData['search_value'] = '' ;
    this.filterData['search_item'] = this.itemOrder.value  ;
    this.filterList(this.filterData);
    this.isFilterApply = false ;
  }

  deleteItem(list){
    this.dispatcher = list ;
    this.deleteById['type'] = this.filterData.type ;
    this.deleteById['delete_id'] = list._id ;
    this.confirmModelRef = this.modalService.show(this.confirmationTemplate, this.confirmationModalConfig);
  }

  cancel(){
    this.confirmModelRef.hide()
  }

  async confirm(){
    await this._commonService.deleteAndUpadateItem(this.deleteById).then(()=>{
      this.confirmModelRef.hide()
    })
  }

  ngOnDestroy(){
    this.userObservable.unsubscribe();
    this.dispatcherObservable.unsubscribe();
  }

  export(){
    if(this.list_data.length != 0){
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

}
