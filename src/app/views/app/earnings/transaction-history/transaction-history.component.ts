import { Component, EventEmitter, OnInit } from '@angular/core';
import { EarningService } from 'src/app/services/earning.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent implements OnInit {
  manualTrigger = false;
  darkTheme = localStorage.getItem('vien-themecolor');
  itemSearch = { label: 'label-title.driver_email', value: 'provider_detail.email' };
  itemOptionsSearch = [
    { label: 'label-title.driver_email', value: 'provider_detail.email' },
    { label: 'label-title.partner_email', value: 'partner_detail.email' },
  ];
  todayDate:Date = new Date();
  changeOrderBy: EventEmitter<any> = new EventEmitter();
  itemsPerPage = 20;
  itemOptionsPerPage = [];
  historyList: any = [];
  currentPage: number = 0;
  pagination_current_page: number = 1;
  item_bsRangeValue;
  search_value: string = '';
  start_date: any = new Date();
  end_date: any = new Date();
  timezone_for_display_date:string = '';
  total_page: number;
  darkMode:boolean=false;
  is_clear_disabled: boolean = true;
  sort_item: any;
  sort_order: number;
  created_date:Date;
  direction = localStorage.getItem('direction');
  show_email:boolean = true;

  constructor(private earingService: EarningService, public _helper:Helper) { }

  ngOnInit(): void {
    const sixDaysAgo = new Date(new Date());
    sixDaysAgo.setDate(new Date().getDate() - 6);
    this.start_date = sixDaysAgo;
    this.getTransactionHistoryList();

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

  getTransactionHistoryList() {
    let start_date: any;
    if (this.start_date) {
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
      search_item: this.itemSearch.value,
      search_value: this.search_value,
      start_date: start_date,
      end_date: end_date,
      limit: this.itemsPerPage,
      sort_item : this.sort_item, 
      sort_order : this.sort_order 
    }
    this.earingService.transactionHistory(json).then(res => {
      if(res.is_show_email === false){
        this.show_email = false;
      }else{
        this.show_email = true;
      }
      if (res.success) {
        if (res.detail.length > 0) {
          this.historyList = res.detail;
          this.total_page = res.pages;
        } else {
          this.historyList = [];
          this.total_page = 0;
        }
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
    this.getTransactionHistoryList();
  }

  onChangeSearchBy(item): void {
    this.is_clear_disabled = false;
    this.itemSearch = item;
  }

  onChangeItemsPerPage(item) {
    if(this.total_page > this.currentPage){
      this.currentPage = 0;
      this.pagination_current_page = 1;
    }
    this.itemsPerPage = item;
    this.getTransactionHistoryList();
  }

  //when change pagination page
  onPage(event) {
    this.currentPage = event - 1;
    this.pagination_current_page = event;
    this.getTransactionHistoryList();
  }

  apply() {
    if (this.item_bsRangeValue?.length) {
      this.start_date = this.item_bsRangeValue[0];
      this.end_date = this.item_bsRangeValue[1];
    }
    this.currentPage = 0;
    this.pagination_current_page = 1;
    this.getTransactionHistoryList();
    this.is_clear_disabled = false;
  }

  // Clear Fliter 
  clear() {
    this.itemSearch = { label: 'label-title.driver_email', value: 'provider_detail.email' };
    this.search_value = '';
    this.currentPage = 0;
    this.pagination_current_page = 1;
    this.item_bsRangeValue = '';
    this.start_date = '';
    this.end_date = '';
    this.itemsPerPage = 20;
    this.getTransactionHistoryList();
    this.is_clear_disabled = true;
  }
}
