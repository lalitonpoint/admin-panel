import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { EarningService } from 'src/app/services/earning.service';
import { Helper } from 'src/app/shared/helper';
import { ExportHistoryModelComponent } from 'src/app/containers/pages/export-history-model/export-history-model.component';
import { EXPORT_HISTORY_EARNING_TYPE } from 'src/app/constants/constants';
import { SocketService } from 'src/app/services/sockert.service';
import { NotifiyService } from 'src/app/services/notifier.service';

@Component({
  selector: 'app-wallet-history',
  templateUrl: './wallet-history.component.html',
  styleUrls: ['./wallet-history.component.scss']
})
export class WalletHistoryComponent implements OnInit {
  manualTrigger = false;
  darkTheme = localStorage.getItem('vien-themecolor');
  itemSearch = { label: 'label-title.description', value: 'wallet_description' };
  itemType = { label: 'label-title.all', value: 0 };
  itemOptionsSearch = [
    { label: 'label-title.description', value: 'wallet_description' , isShow : true },
    { label: 'label-title.email', value: 'email' , isShow : true },
  ];
  itemOptionsType = [
    { label: 'label-title.all', value: 0 },
    { label: 'label-title.user', value: 10 },
    { label: 'label-title.driver', value: 11 },
    { label: 'label-title.corporate', value: 5 },
    { label: 'label-title.partner', value: 4 },
  ];
  todayDate:Date = new Date();
  changeOrderBy: EventEmitter<any> = new EventEmitter();
  itemsPerPage = 20;
  itemOptionsPerPage = [];
  currentPage: number = 0;
  pagination_current_page: number = 1;
  start_date: any = new Date();
  end_date: any = new Date();
  timezone_for_display_date:string = '';
  total_page: number;
  historyList: any = [];
  item_bsRangeValue;
  search_value: string = '';
  is_export: boolean = false;
  darkMode:boolean=false;
  is_clear_disabled: boolean = false;
  sort_item: any;
  sort_order: number;
  created_date:Date;
  header : any ;
  direction = localStorage.getItem('direction');

  @ViewChild('ExportHistotyModel', { static: true }) ExportHistotyModel: ExportHistoryModelComponent;

  constructor(private earingService: EarningService, public _helper: Helper,private _socket:SocketService,private _notifierService:NotifiyService) { }

  ngOnInit(): void {
    const sixDaysAgo = new Date(new Date());
    sixDaysAgo.setDate(new Date().getDate() - 6);
    this.start_date = sixDaysAgo;
    this.getwalletHistoryList();

    this.itemOptionsPerPage = this._helper.PER_PAGE_LIST;
    if(this.darkTheme.startsWith('dark')){
      this.darkMode=true;
    }
    this._helper.display_date_timezone.subscribe(data => {
      this.timezone_for_display_date = data;
    })
    this._helper.created_date.subscribe(data => {
      if(data){
        let date = new Date(data)
        this.created_date = date;
      }
    })
  }

  onChangeSearchBy(item): void {
    this.is_clear_disabled = false;
    this.itemSearch = item;
  }

  onChangeSortBy(item): void {
    this.is_clear_disabled = false;
    this.itemType = item;
  }

  onChangeItemsPerPage(item) {
    if(this.total_page > this.currentPage){
      this.currentPage = 0;
      this.pagination_current_page = 1;
    }
    this.itemsPerPage = item;
    this.getwalletHistoryList();
  }

  getwalletHistoryList() {
    let start_date: any;
    if (this.start_date) {
      this.start_date.setHours(0,0,0,0);
      const diff = new Date(this.start_date).getTimezoneOffset() * 60000
      const secs = new Date(this.start_date).getTime()
      start_date = new Date(secs - diff).toUTCString()
    }
    let end_date: any;
    if (this.end_date) {
      const diff = new Date(this.end_date).getTimezoneOffset() * 60000
      const secs = new Date(this.end_date).getTime()
      end_date = new Date(secs - diff).toUTCString()
    }
    this.item_bsRangeValue = [this.start_date,this.end_date];

    let json: any = {
      page: this.currentPage,
      sort_item : this.sort_item, 
      sort_order : this.sort_order ,
      search_item: this.itemSearch.value,
      search_value: this.search_value,
      start_date: start_date,
      end_date: end_date,
      limit: this.itemsPerPage,
      type: this.itemType.value,
      is_excel_sheet: this.is_export,
      export_user_id: this._helper.user_details._id,
      header: this.header
    }
    this.earingService.walletHistory(json).then(res => {
      if (res && this.is_export === true) {
        this._notifierService.showNotification('success', this._helper.trans.instant('alert.exported-success'));
        this.is_export = false;
        this.header = '';
        return;
      }
      if (res.success) {
        if (res.detail.length > 0) {
          this.historyList = res.detail;
          this.total_page = res.pages
        } else {
          this.historyList = [];
          this.total_page = 0;
        }
        this.itemOptionsSearch.forEach((data) => {
          if(data.value == 'email' && res.is_show_email === false){
            data.isShow = false ;
          }
        })
      }
    })
  }

  //sort 
  onSort(item) {
    if (item === this.sort_item) {
      if (this.sort_order === -1) {
        this.sort_order = 1
      } else {
        this.sort_order = -1
      }
    } else {
      this.sort_item = item
      this.sort_order = 1
    }
    this.getwalletHistoryList();
  }

  //when change pagination page
  onPage(event) {
    this.currentPage = event - 1;
    this.pagination_current_page = event;
    this.getwalletHistoryList();
  }

  apply() {
    if (this.item_bsRangeValue?.length) {
      this.start_date = this.item_bsRangeValue[0];
      this.end_date = this.item_bsRangeValue[1];
    }
    this.currentPage = 0;
    this.pagination_current_page = 1;
    this.getwalletHistoryList();
    this.is_clear_disabled = false;
  }

  //export
  export() {
    if(this.historyList.length != 0){
      let header = {
        id : this._helper.trans.instant('heading-title.id'),
        type : this._helper.trans.instant('heading-title.type'),
        date : this._helper.trans.instant('heading-title.date'),
        email : this._helper.trans.instant('heading-title.email'),
        currency : this._helper.trans.instant('heading-title.currency'),
        wallet_amount : this._helper.trans.instant('heading-title.wallet-amount'),
        add_cut : this._helper.trans.instant('heading-title.add/cut'),
        wallet : this._helper.trans.instant('heading-title.wallet'),
        from_where : this._helper.trans.instant('heading-title.from-where'),
  
        user : this._helper.trans.instant('label-title.user'),
        provider : this._helper.trans.instant('label-title.driver'),
        partner : this._helper.trans.instant('label-title.partner'),
        corporate : this._helper.trans.instant('menu.corporate'),
      }
        
      this.header = JSON.stringify(header);
      this.is_export = true;
      this.getwalletHistoryList();
      setTimeout(() => {
        this.showExportHistoryModal();
      }, 500);
    }else{
      this._notifierService.showNotification('error', this._helper.trans.instant('label-title.no-record-found'));
    }
  }

  // Clear Fliter 
  clear() {
    this.currentPage = 0;
    this.pagination_current_page = 1;
    this.itemType = { label: 'label-title.all', value: 0 };
    this.itemSearch = { label: 'label-title.description', value: 'wallet_description' };
    this.search_value = '';
    const sixDaysAgo = new Date(new Date());
    sixDaysAgo.setDate(new Date().getDate() - 6);
    this.start_date = sixDaysAgo;
    this.end_date = new Date();
    this.item_bsRangeValue = [this.start_date,this.end_date];
    this.itemsPerPage = 20;
    this.is_export = false;
    this.getwalletHistoryList();
    this.is_clear_disabled = true;
  }

  showExportHistoryModal(): void {
    this.ExportHistotyModel.show(EXPORT_HISTORY_EARNING_TYPE.WALLET_HISTORY,this._helper.user_details._id) ;
  }

  exportHistorySocket(){
    this._socket.listener("export_history_socket").subscribe((response:any) => {
      if(response && response.type == EXPORT_HISTORY_EARNING_TYPE.WALLET_HISTORY){
        this.showExportHistoryModal();
      }
    })
  }

}
