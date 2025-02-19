import { NotifiyService } from '../../../../services/notifier.service';
import { Subscription } from 'rxjs';
import { Helper } from 'src/app/shared/helper';
import { CommonService } from 'src/app/services/common.service';
import { HubService } from '../../../../services/hub.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AddHubModelComponent } from 'src/app/containers/pages/add-hub-model/add-hub-model.component';
import { EditHubModelComponent } from 'src/app/containers/pages/edit-hub-model/edit-hub-model.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.scss']
})
export class HubComponent implements OnInit {
  darkTheme = localStorage.getItem('vien-themecolor');
  itemOrder = { label: 'label-title.id', value: 'unique_id' };
  itemOptionsOrders = [
    { label: 'label-title.id', value: 'unique_id', isShow : true },
    { label: 'label-title.name', value: 'name', isShow : true },
    { label: 'label-title.country', value: 'city_detail.countryname', isShow : true },
    { label: 'label-title.city', value: 'city_detail.cityname', isShow : true },
   ];
  userObservable: Subscription;
  hotelObservable: Subscription ;
  data: any;
  filterData = { type : '' , page_no : 1 , item_per_page : 15 };
  confirmationModalConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  hub_list : any = [];
  search_value : any = '';
  searchBy : any = this.itemOrder.value ;
  hub : any ;
  header : any ;
  deleteById = {};
  count : number ;
  viewType: number = 1;
  currentPage:number = 1;
  confirmModelRef: BsModalRef;
  darkMode:boolean=false;
  isFilterApply : boolean = false ;
  itemsPerPage = 15;
  itemOptionsPerPage = [];

  @ViewChild('hubListModel', { static: true }) hubListModel: AddHubModelComponent;
  @ViewChild('hubSettingModal', { static: true }) hubSettingModal: EditHubModelComponent;
  @ViewChild('confirmationTemplate', { static: true }) confirmationTemplate: TemplateRef<any>;



  constructor(private _hubService: HubService, private _commonService: CommonService, private modalService: BsModalService, public _helper: Helper, private _notifierService: NotifiyService) { }

  ngOnInit(): void {
    this.filterData['type'] = this._helper.PANEL_TYPE.HUB;
    this.itemOptionsPerPage = this._helper.USERS_PER_PAGE_LIST;
    this.filterData['search_item'] = this.searchBy;
    this.userObservable = this._commonService._userObservable.subscribe(() => {
      this.getHubFilterData(this.filterData);
    })

    this.hotelObservable = this._hubService._hubObservable.subscribe(()=>{
      this.getHubFilterData(this.filterData)
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

  showHubListModal(): void{
    this.hubListModel.show(this.filterData.type);
  }
  showHubSettingModal(id): void{
    this.hubSettingModal.show(id , this.filterData.type);
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
    this.getHubFilterData(this.filterData)
  }

  pageChanged(event){
    this.currentPage = event;
    this.filterData['page_no']  = event;
    this.getHubFilterData(this.filterData)
  }

  getHubFilterData(filterData){
    this._commonService.getAdminTypeList(filterData).then((res_data : any) => {
      this.hub_list = res_data.type_list ;
      this.count = res_data.total_page;
      setTimeout(() => {
        if(this.hub_list.length == 0 && this.filterData['page_no'] != 1){
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

  apply(search_value){
    this.currentPage = 1;
    this.filterData['page_no'] = 1;
    this.filterData['search_value'] = search_value ;
    if(this.search_value != ''){
      this.getHubFilterData(this.filterData);
      this.isFilterApply = true;
    }
  }

  clear(){
    this.currentPage = 1;
    this.filterData['page_no'] = 1;
    this.search_value = ''
    this.filterData['search_value'] = '' ;
    this.itemOrder = { label: 'label-title.id', value: 'unique_id' };
    this.filterData['search_item'] = this.itemOrder.value ;

    this.getHubFilterData(this.filterData);
    this.isFilterApply = false;
  }

  deleteHub(list){
    this.hub = list ;
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

  export(){
    if(this.hub_list.length != 0){
      let header = {
        id : this._helper.trans.instant('label-title.id'),
        name : this._helper.trans.instant('heading-title.name'),
        country : this._helper.trans.instant('menu.country'),
        city : this._helper.trans.instant('label-title.city'),
        address : this._helper.trans.instant('label-title.address'),
      }

      this.header = JSON.stringify(header);
      this.filterData['header'] = this.header
      this.filterData['is_excel_sheet'] = true ;
      this._commonService.getAdminTypeList(this.filterData).then((res : any) => {
        this._helper.downloadFile(res.url);
        this.filterData['is_excel_sheet'] = null ;
        this.header = '' ;
      });
    }else{
      this._notifierService.showNotification('error', this._helper.trans.instant('label-title.no-record-found'));
    }
  }

  ngOnDestroy(){
    this.userObservable.unsubscribe();
  }
}
