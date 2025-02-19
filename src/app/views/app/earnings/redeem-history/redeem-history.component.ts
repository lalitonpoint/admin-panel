import { Component, EventEmitter, OnInit } from '@angular/core';
import { EarningService } from 'src/app/services/earning.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-redeem-history',
  templateUrl: './redeem-history.component.html',
  styleUrls: ['./redeem-history.component.scss']
})
export class RedeemHistoryComponent implements OnInit {
  manualTrigger = false;
  darkTheme = localStorage.getItem('vien-themecolor');
  itemSearch = { label: 'label-title.description', value: 'redeem_point_description' };
  itemType = { label: 'label-title.all', value: 0 };
  itemOptionsSearch = [
    { label: 'label-title.description', value: 'redeem_point_description' , isShow : true },
    { label: 'label-title.email', value: 'email' , isShow : true },
  ];
  itemOptionsType = [
    { label: 'label-title.all', value: 0 },
    { label: 'label-title.user', value: 10 },
    { label: 'label-title.driver', value: 11 },
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
  is_clear_disabled: boolean = true;
  sort_item: any;
  sort_order: number;
  created_date:Date;
  direction = localStorage.getItem('direction');

  constructor(private earingService: EarningService, public _helper: Helper) { }

  ngOnInit(): void {
    const sixDaysAgo = new Date(new Date());
    sixDaysAgo.setDate(new Date().getDate() - 6);
    this.start_date = sixDaysAgo;
    this.getwalletHistoryList();

    this.itemOptionsPerPage = this._helper.PER_PAGE_LIST;
    if(this.darkTheme.startsWith('dark') ){
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
      is_export: this.is_export
    }
    this.earingService.redeemPointHistory(json).then(res => {
      if (res && this.is_export) {
        this._helper.downloadFile(res);
        this.is_export = false;
      }
      if (res) {
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
    this.is_export = true;
    this.getwalletHistoryList();
  }

  // Clear Fliter 
  clear() {
    this.currentPage = 0;
    this.pagination_current_page = 1;
    this.itemType = { label: 'label-title.all', value: 0 };
    this.itemSearch = { label: 'label-title.description', value: 'redeem_point_description' };
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

}
