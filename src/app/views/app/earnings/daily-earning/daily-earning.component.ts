import { NotifiyService } from './../../../../services/notifier.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CityService } from 'src/app/services/city.service';
import { CountryService } from 'src/app/services/country.service';
import { Helper } from 'src/app/shared/helper';
import { EarningService } from '../../../../services/earning.service';
import { ExportHistoryModelComponent } from 'src/app/containers/pages/export-history-model/export-history-model.component';
import { EXPORT_HISTORY_EARNING_TYPE } from 'src/app/constants/constants';
import { SocketService } from 'src/app/services/sockert.service';

@Component({
  selector: 'app-daily-earning',
  templateUrl: './daily-earning.component.html',
  styleUrls: ['./daily-earning.component.scss']
})
export class DailyEarningComponent implements OnInit {
  darkTheme = localStorage.getItem('vien-themecolor')
  itemsPerPage = 20;
  itemOptionsPerPage = [];
  itemSearch = { label: 'label-title.name', value: 'provider_detail.first_name' };
  itemOptionsSearch = [
    { label: 'label-title.name', value: 'provider_detail.first_name' , isShow : true },
    { label: 'label-title.phone', value: 'provider_detail.phone' , isShow : true }];
  selectedCountryId: string = 'all';
  selectedCityId: string = 'all';
  search_value: string = '';
  tomorrowDate: Date = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) 
  todayDate: Date = new Date()
  start_date=this.todayDate;
  end_date=this.todayDate;
  item_bsRangeValue= this.todayDate;
  tripId: string;
  currentPage: number = 0;
  pagination_current_page: number = 1;
  total_page: number;
  typestatement: number ;
  country: any;
  city:any;
  header : any ;
  country_list: any = [];
  city_list: any = [];
  earningList: any = [];
  tripTotalData: any = [];
  is_export:boolean = false;
  darkMode:boolean=false;
  is_clear_disabled:boolean = true;
  sort_order:number;
  sort_item:string;
  created_date:Date;
  direction = localStorage.getItem('direction');

  @ViewChild('ExportHistotyModel', { static: true }) ExportHistotyModel: ExportHistoryModelComponent;

  constructor(public _helper: Helper, private earingService: EarningService, private _countryService: CountryService, private _cityService: CityService , private _notifierService : NotifiyService, private _socket:SocketService) { }

  ngOnInit(): void {
    this.getCountryList();
    this.getTripEarningList();

    this.itemOptionsPerPage = this._helper.PER_PAGE_LIST;
    if(this.darkTheme.startsWith('dark')){
      this.darkMode=true;
    }
    this._helper.created_date.subscribe(data => {
      if(data){
        let date = new Date(data)
        this.created_date = date;
      }
    })
    this.exportHistorySocket();
  }

  showExportHistoryModal(): void {
    this.ExportHistotyModel.show(EXPORT_HISTORY_EARNING_TYPE.DAILY_EARNING,this._helper.user_details._id) ;
  }

  // get trip daily earning list
  getTripEarningList() {
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
    let json: any = { earning_type: 'Daily_earning', search_item: this.itemSearch.value, search_value: this.search_value, page: this.currentPage, selected_country: this.selectedCountryId, selected_city: this.selectedCityId, start_date: start_date, end_date: end_date, limit: this.itemsPerPage,is_export:this.is_export,sort_item : this.sort_item, sort_order : this.sort_order , header : this.header , export_user_id:this._helper.user_details._id  };
    this.earingService.dailyWeeklyTripEarning(json).then(res => {
      if (res && this.is_export) {
        this._notifierService.showNotification('success', this._helper.trans.instant('alert.exported-success'));
        this.is_export = false;
        this.header = '';
        return;
      }
      if (res.success) {
        if(res.detail.length > 0){
          this.earningList = res.detail;
          this.tripTotalData = res.trip_total;
          this.total_page = res.pages;
        }else{
          this.earningList = [];
          this.tripTotalData = [];
          this.total_page = 0;
        }
        this.itemOptionsSearch.forEach((data) => {
          if(data.value == 'provider_detail.phone' && !res.is_show_phone){
            data.isShow = false ;
          }
        })
      }
    })
  }

  //sort 
  onSort(item){
    if (item === this.sort_item ) {
      if (this.sort_order === -1) {
        this.sort_order = 1
      } else {
        this.sort_order = -1
      }
    } else {
      this.sort_item = item
      this.sort_order = 1
    }
    this.getTripEarningList();
  }

  // get CountryList
  getCountryList() {
    this._countryService.fetchCountry().then(res => {
      if (res.success) {
        this.country_list = res.country_list;
      } else {
        this.country_list = []
      }
    })
  }

  // get city from country 
  getCityList(country_Id) {
    this._cityService.fetchDestinationCity({ country_id: country_Id, type:1  }).then(res => {
      if (res.success) {
        this.city = null;
        this.selectedCityId = 'all'
        this.city_list = res.destination_list;
      } else {
        this.city = null;
        this.selectedCityId = 'all'
        this.city_list = [];
      }
    })
  }

  // get country to input field
  getCountry(countryId) {
    this.selectedCountryId = countryId
    this.getCityList(countryId);
  }

  // get city to input field
  getCity(cityId) {
    this.is_clear_disabled = false;
    this.selectedCityId = cityId;
  }

  // open earning statement component
  showAddNewModal(tripId): void {
    if (tripId && this.item_bsRangeValue) {
      this.tripId = tripId;
      this.typestatement=1;
      this.start_date = this.item_bsRangeValue;
      this.end_date = this.item_bsRangeValue;
    }
  }

  // search filter flow start 

  //when change value in serch by dropdown
  onChangeSearchBy(item): void {
    this.is_clear_disabled = false;
    this.itemSearch = item;
  }

  //when change page limit
  onChangeItemsPerPage(item) {
    if(this.total_page > this.currentPage){
      this.currentPage = 0;
      this.pagination_current_page = 1;
    }
    this.itemsPerPage = item;
    this.getTripEarningList();
  }

  //when change pagination page
  onPage(event) {
    this.currentPage = event - 1;
    this.pagination_current_page = event;
    this.getTripEarningList();
  }

  //apply filter
  apply() {
    this.currentPage = 0;
    this.pagination_current_page = 1;
    if (this.item_bsRangeValue) {
      this.is_clear_disabled = false;
      this.start_date = this.item_bsRangeValue;
      this.end_date = this.item_bsRangeValue;
    }
    this.getTripEarningList();
  }
  // search filter flow end

  back(){
    this.tripId=null;
  }

  //export
  export() {
    if(this.earningList.length != 0 ){
      let header = {
        trip_id : this._helper.trans.instant('heading-title.trip_id'),
        trip_end : this._helper.trans.instant('heading-title.trip_end'),
        driver_id : this._helper.trans.instant('heading-title.driver-id'),
        name : this._helper.trans.instant('heading-title.name'),
        phone : this._helper.trans.instant('heading-title.phone'),
        total : this._helper.trans.instant('heading-title.total'),
        cash : this._helper.trans.instant('heading-title.cash'),
        driver_profit : this._helper.trans.instant('label-title.driver-profit'),
        pay_to_driver : this._helper.trans.instant('label-title.pay-to-driver')
      }
        
      this.header = JSON.stringify(header);
      this.is_export = true;
      this.getTripEarningList();
      setTimeout(() => {
        this.showExportHistoryModal();
      }, 500);
    }else{
      this._notifierService.showNotification('error', this._helper.trans.instant('label-title.no-record-found'));
    }
  }

  clear() {
    this.itemSearch = { label: 'label-title.name', value: 'provider_detail.first_name' };
    this.search_value = '';
    this.currentPage = 0;
    this.pagination_current_page = 1;
    this.selectedCountryId = 'all';
    this.selectedCityId = 'all';
    this.city = null;
    this.country = null;
    this.item_bsRangeValue = this.todayDate;
    this.start_date = this.todayDate;
    this.end_date = this.todayDate;
    this.itemsPerPage = 20;
    this.is_export = false;
    this.city_list = [];
    this.getTripEarningList();
    this.is_clear_disabled = true;
  }

  exportHistorySocket(){
    this._socket.listener("export_history_socket").subscribe((response:any) => {
      if(response && response.type == EXPORT_HISTORY_EARNING_TYPE.DAILY_EARNING){
        this.showExportHistoryModal();
      }
    })
  }

}

