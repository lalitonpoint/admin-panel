import { Component, OnInit, ViewChild } from '@angular/core';
import { ExportHistoryModelComponent } from 'src/app/containers/pages/export-history-model/export-history-model.component';
import { RentalTripDetailModelComponent } from 'src/app/containers/pages/rental-trip-detail-model/rental-trip-detail-model.component';
import { CountryService } from 'src/app/services/country.service';
import { EarningService } from 'src/app/services/earning.service';
import { NotifiyService } from 'src/app/services/notifier.service';
import { SocketService } from 'src/app/services/sockert.service';
import { Helper } from 'src/app/shared/helper';
import { TRIP_STATUS, EXPORT_HISTORY_EARNING_TYPE } from 'src/app/constants/constants';

@Component({
  selector: 'app-rental-request-earning',
  templateUrl: './rental-request-earning.component.html',
  styleUrls: ['./rental-request-earning.component.scss']
})
export class RentalRequestEarningComponent implements OnInit {

  itemsPerPage = 20;
  itemOptionsPerPage = [];
  itemSearch = { label: 'label-title.name', value: 'provider_first_name' };
  itemOptionsSearch = [
    { label: 'heading-title.trip_id', value: 'unique_id' , isShow : true },
    { label: 'label-title.phone', value: 'provider_phone' , isShow : true },
    { label: 'label-title.name', value: 'provider_first_name' , isShow : true },
  ]
  item_bsRangeValue;
  todayDate: Date = new Date();
  selectedCountryId: string = 'all';
  selectedCityId: string = 'all';
  city: any;
  country: any;
  header : any ;
  search_value: string = '';
  start_date: any = '';
  end_date: any = '';
  timezone_for_display_date:string = '';
  currentPage: number = 0;
  pagination_current_page: number = 1;
  total_page: number;
  country_list: any = [];
  city_list: any = [];
  is_export: boolean = false;
  darkMode:boolean=false;
  sort_order:number;
  sort_item:string;
  created_date:Date;
  is_clear_disabled: boolean = true;
  direction = localStorage.getItem('direction');
  darkTheme = localStorage.getItem('vien-themecolor');
  earningList: any = [];
  tripTotalData: any = [];
  TRIP_STATUS = TRIP_STATUS;
  EXPORT_HISTORY_EARNING_TYPE = EXPORT_HISTORY_EARNING_TYPE;

  @ViewChild('ExportHistotyModel', { static: true }) ExportHistotyModel: ExportHistoryModelComponent;
  @ViewChild('rentalTripDetailsModal', { static: true }) rentalTripDetailsModal: RentalTripDetailModelComponent;

  constructor(public _helper:Helper, private _countryService: CountryService, private earingService: EarningService, private _notifierService: NotifiyService, private _socket: SocketService) { }

  ngOnInit(): void {
    this.getCountryList();
    this.getRentalTripEarningList();

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

  // get country to input field
  getCountry(countryId) {
    this.selectedCountryId = countryId;
  }

    // open trip invoice modal
    showAddNewModal(id, status): void {
      if(status == 1){
        this.rentalTripDetailsModal.show(id, TRIP_STATUS.COMPLETED, this.timezone_for_display_date);
      } else {
        this.rentalTripDetailsModal.show(id, TRIP_STATUS.CANCELLED, this.timezone_for_display_date);
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
    this.getRentalTripEarningList();
  }

  //when change pagination page
  onPage(event) {
    this.currentPage = event - 1;
    this.pagination_current_page = event;
    this.getRentalTripEarningList();
  }

  //apply filter
  apply() {
    this.currentPage = 0;
    this.pagination_current_page = 1;
    if (this.item_bsRangeValue?.length) {
      this.is_clear_disabled = false;
      this.start_date = this.item_bsRangeValue[0];
      this.end_date = this.item_bsRangeValue[1];
    }
    this.getRentalTripEarningList();
  }

  // Clear Fliter
  clear() {
    this.is_clear_disabled = true;
    this.itemSearch = { label: 'label-title.name', value: 'provider_first_name' };
    this.search_value = '';
    this.currentPage = 0;
    this.pagination_current_page = 1;
    this.selectedCountryId = 'all';
    this.country = null;
    this.item_bsRangeValue = '';
    this.start_date = '';
    this.end_date = '';
    this.itemsPerPage = 20;
    this.is_export = false;
    this.getRentalTripEarningList();
  }

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
    this.getRentalTripEarningList();
  }

  // search filter flow end

  //export
  export() {
    if(this.earningList.length != 0){
      let header = {
        trip_id : this._helper.trans.instant('heading-title.trip_id'),
        trip_end : this._helper.trans.instant('heading-title.trip_end'),
        driver_id : this._helper.trans.instant('heading-title.driver-id'),
        name : this._helper.trans.instant('heading-title.name'),
        phone : this._helper.trans.instant('heading-title.phone'),
        total : this._helper.trans.instant('heading-title.total'),
        card : this._helper.trans.instant('label-title.card'),
        wallet : this._helper.trans.instant('heading-title.wallet'),
        driver_profit : this._helper.trans.instant('label-title.driver-profit'),
        pay_to_driver : this._helper.trans.instant('label-title.pay-to-driver')
      }

      this.header = JSON.stringify(header);
      this.is_export = true;
      this.getRentalTripEarningList();
      setTimeout(() => {
        this.showExportHistoryModal();
      }, 500);
    }else{
      this._notifierService.showNotification('error', this._helper.trans.instant('label-title.no-record-found'));
    }
  }

  showExportHistoryModal(): void {
    this.ExportHistotyModel.show(EXPORT_HISTORY_EARNING_TYPE.RENTAL_TRIP_EARNING, this._helper.user_details._id);
  }

   // get trip earning list
   getRentalTripEarningList() {
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
    let json: any = { search_item: this.itemSearch.value, search_value: this.search_value, page: this.currentPage, selected_country: this.selectedCountryId, start_date: start_date, end_date: end_date, limit: this.itemsPerPage, is_export: this.is_export, sort_item: this.sort_item, sort_order: this.sort_order, header: this.header, export_user_id: this._helper.user_details._id };
    this.earingService.rentalTripEarning(json).then(res => {
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
          if (data.value == 'provider_details.phone' && res.is_show_phone === false) {
            data.isShow = false;
          }
        })
      }
    })
  }

}
