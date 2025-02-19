import { NotifiyService } from './../../../../services/notifier.service';
import { Subscription } from 'rxjs';
import { Helper } from 'src/app/shared/helper';
import { CommonService } from 'src/app/services/common.service';
import { HotelService } from './../../../../services/hotel.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AddHotelModelComponent } from 'src/app/containers/pages/add-hotel-model/add-hotel-model.component';
import { EditHotelModelComponent } from 'src/app/containers/pages/edit-hotel-model/edit-hotel-model.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.component.html',
  styleUrls: ['./hotel.component.scss']
})
export class HotelComponent implements OnInit {
  darkTheme = localStorage.getItem('vien-themecolor');
  itemOrder = { label: 'label-title.id', value: 'unique_id' };
  itemOptionsOrders = [
    { label: 'label-title.id', value: 'unique_id', isShow : true },
    { label: 'label-title.name', value: 'hotel_name', isShow : true },
    { label: 'label-title.email', value: 'email', isShow : true },
    { label: 'label-title.phone', value: 'phone', isShow : true },
    { label: 'label-title.country', value: 'country', isShow : true },
    { label: 'label-title.city', value: 'city', isShow : true },
   ];
  userObservable: Subscription;
  hotelObservable: Subscription ;
  data: any;
  filterData = { type : '' , page_no : 1 , item_per_page : 15 };
  confirmationModalConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  hotel_list : any = [];
  search_value : any = '';
  searchBy : any = this.itemOrder.value ;
  hotel : any ;
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

  @ViewChild('hotelListModel', { static: true }) hotelListModel: AddHotelModelComponent;
  @ViewChild('confirmationTemplate', { static: true }) confirmationTemplate: TemplateRef<any>;
  @ViewChild('hotelSettingModal', { static: true }) hotelSettingModal: EditHotelModelComponent;

  constructor(private _hotelService: HotelService, private _commonService: CommonService, private modalService: BsModalService, public _helper: Helper, private _notifierService: NotifiyService) { }

  ngOnInit(): void {
    this.itemOptionsPerPage = this._helper.USERS_PER_PAGE_LIST;
    this.filterData['type'] = this._helper.PANEL_TYPE.HOTEL;
    this.filterData['search_item'] = this.searchBy;
    this.userObservable = this._commonService._userObservable.subscribe(() => {
      this.getHotelFilterData(this.filterData);
    })

    this.hotelObservable = this._hotelService._hotelObservable.subscribe(()=>{
      this.getHotelFilterData(this.filterData)
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

  showHotelListModal(): void{
    this.hotelListModel.show(this.filterData.type);
  }

  showHotelSettingModal(id): void{
    this.hotelSettingModal.show(id , this.filterData.type);
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
    this.getHotelFilterData(this.filterData)
  }

  pageChanged(event){
    this.currentPage = event;
    this.filterData['page_no']  = event;
    this.getHotelFilterData(this.filterData)
  }

  getHotelFilterData(filterData){
    this._commonService.getAdminTypeList(filterData).then((res_data : any) => {
      this.hotel_list = res_data.type_list ;
      this.count = res_data.total_page;
      setTimeout(() => {
        if(this.hotel_list.length == 0 && this.filterData['page_no'] != 1){
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
      this.getHotelFilterData(this.filterData);
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

    this.getHotelFilterData(this.filterData);
    this.isFilterApply = false;
  }

  deleteHotel(list){
    this.hotel = list ;
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
    if(this.hotel_list.length != 0){
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
