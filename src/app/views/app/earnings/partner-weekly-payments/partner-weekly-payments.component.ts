import { NotifiyService } from './../../../../services/notifier.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CityService } from 'src/app/services/city.service';
import { CountryService } from 'src/app/services/country.service';
import { Helper } from 'src/app/shared/helper';
import { EarningService } from '../../../../services/earning.service';
import { EarningStatementComponent } from '../earning-statement/earning-statement.component';
import { ExportHistoryModelComponent } from 'src/app/containers/pages/export-history-model/export-history-model.component';
import { EXPORT_HISTORY_EARNING_TYPE } from 'src/app/constants/constants';
import { SocketService } from 'src/app/services/sockert.service';

@Component({
  selector: 'app-partner-weekly-payments',
  templateUrl: './partner-weekly-payments.component.html',
  styleUrls: ['./partner-weekly-payments.component.scss']
})
export class PartnerWeeklyPaymentsComponent implements OnInit {
  itemsPerPage = 20;
  itemOptionsPerPage = [];
  itemSearch = { label: 'label-title.name', value: 'provider_detail.first_name' };
  itemOptionsSearch = [
    { label: 'label-title.name', value: 'provider_detail.first_name' , isShow : true },
    { label: 'label-title.phone', value: 'provider_detail.phone' , isShow : true }];
  selectedCountryId: string = 'all';
  selectedCityId: string = 'all';
  search_value: string = '';
  sevenDaysAgo: Date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  todayDate: Date = new Date()
  start_date:any = this.sevenDaysAgo;
  end_date = this.todayDate;
  item_bsRangeValue = [this.sevenDaysAgo, new Date(Date.now())];
  tripId: string;
  currentPage: number = 0;
  pagination_current_page: number = 1;
  total_page: number;
  typestatement: number;
  country_list: any = [];
  city_list: any = [];
  earningList: any = [];
  tripTotalData: any = [];
  country: any;
  city:any;
  header: any;
  selectedWeek:any = [];
  week_days = [];
  is_export:boolean = false;
  darkMode:boolean=false;
  is_clear_disabled:boolean = true;
  sort_item: any;
  sort_order: number;
  created_date:Date;
  darkTheme = localStorage.getItem('vien-themecolor');

  @ViewChild('statementRef', { static: true }) statementRef: EarningStatementComponent;
  @ViewChild('ExportHistotyModel', { static: true }) ExportHistotyModel: ExportHistoryModelComponent;

  constructor(public _helper: Helper, private earingService: EarningService, private _countryService: CountryService, private _cityService: CityService ,private _notifierService : NotifiyService, private _socket:SocketService)  { }

  ngOnInit(): void {
    this.itemOptionsPerPage = this._helper.PER_PAGE_LIST;
    this._helper.created_date.subscribe(data => {
      if(data){
        let date = new Date(data)
        this.created_date = date;
        this.configWeekDayList();
        this.getCountryList();
        this.getTripEarningList();
      }
    })
    if(this.darkTheme.startsWith('dark')){
      this.darkMode=true;
    }
    this.exportHistorySocket();
  }

  configWeekDayList() {
    const startDate = new Date(this.created_date);
    const weeks = this._helper.getWeeks(startDate);
    this.week_days = weeks;
    this.week_days.reverse();
    this.selectedWeek = this.week_days[0];
    this.start_date = this.selectedWeek.start;
    this.end_date = this.selectedWeek.end;
  }

  showExportHistoryModal(): void {
    this.ExportHistotyModel.show(EXPORT_HISTORY_EARNING_TYPE.PARTNER_WEEKLY_EARNING,this._helper.user_details._id) ;
  }

  // get trip daily earning list
  getTripEarningList() {
    let json: any = { search_item: this.itemSearch.value, search_value: this.search_value, page: this.currentPage, selected_country: this.selectedCountryId, selected_city: this.selectedCityId, start_date: this.start_date.toString(), end_date: this.end_date.toString(), limit: this.itemsPerPage,is_export:this.is_export,sort_item : this.sort_item, sort_order : this.sort_order , header : this.header , export_user_id:this._helper.user_details._id };
    this.earingService.partnerWeeklyTripEarning(json).then(res => {
      if (res && this.is_export === true) {
        this._notifierService.showNotification('success', this._helper.trans.instant('alert.exported-success'));
        this.is_export = false;
        this.header = '';
        return;
      }
      if (res.success) {
        if (res.detail.length > 0) {
          this.earningList = res.detail;
          this.tripTotalData = res.trip_total;
          this.total_page = res.pages;
        } else {
          this.earningList = [];
          this.tripTotalData = [];
          this.total_page = 0;
        }

        this.itemOptionsSearch.forEach((data) => {
          if(data.value == 'provider_detail.phone' && res.is_show_phone === false){
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
    if (tripId) {
      this.tripId = tripId;
      this.typestatement = 3;
      this.start_date = this.selectedWeek.start;
      this.end_date = this.selectedWeek.end;
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
    this.start_date = this.selectedWeek.start;
    this.end_date = this.selectedWeek.end;
    this.is_clear_disabled = false;
    this.getTripEarningList();
  }
  // search filter flow end

  back(){
    this.tripId=null;
  }

  //export
  export() {

    if(this.earningList.length != 0){
      let header = {
        partner_id : this._helper.trans.instant('menu.partner')+ ' ' + this._helper.trans.instant('heading-title.id'),
        name : this._helper.trans.instant('heading-title.name'),
        phone : this._helper.trans.instant('heading-title.phone'),
        total : this._helper.trans.instant('heading-title.total'),
        cash : this._helper.trans.instant('heading-title.cash'),
        driver_profit : this._helper.trans.instant('label-title.partner')+ ' '+ this._helper.trans.instant('heading-title.profit'),
        pay_to_partner : this._helper.trans.instant('heading-title.pay-to')+ ' '+this._helper.trans.instant('label-title.partner')
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
    this.selectedWeek = this.week_days[0];
    this.start_date = this.selectedWeek.start;
    this.end_date = this.selectedWeek.end;
    this.itemsPerPage = 20;
    this.is_export = false;
    this.city_list = [];
    this.getTripEarningList();
    this.is_clear_disabled = true;
  }

  exportHistorySocket(){
    this._socket.listener("export_history_socket").subscribe((response:any) => {
      if(response && response.type == EXPORT_HISTORY_EARNING_TYPE.PARTNER_WEEKLY_EARNING){
        this.showExportHistoryModal();
      }
    })
  }

}