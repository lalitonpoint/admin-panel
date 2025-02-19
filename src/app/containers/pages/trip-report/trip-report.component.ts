import { Helper } from 'src/app/shared/helper';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TripDetailsModalComponent } from 'src/app/containers/pages/trip-details-modal/trip-details-modal.component';
import { RequestService } from 'src/app/services/request.service';
import { PROVIDER_STATUS, PROVIDER_ACCEPTED, TRIP_STATUS, RequestMainType } from 'src/app/constants/constants';
import { ExportHistoryModelComponent } from 'src/app/containers/pages/export-history-model/export-history-model.component';
import { CityService } from 'src/app/services/city.service';
import { CountryService } from 'src/app/services/country.service';
import { MapViewService } from 'src/app/services/map-view.service';
import { SocketService } from 'src/app/services/sockert.service';
import { NotifiyService } from 'src/app/services/notifier.service';
import { OpenRideTripDetailsModalComponent } from '../open-ride-trip-details-modal/open-ride-trip-details-modal.component';
import { RentalTripDetailModelComponent } from '../rental-trip-detail-model/rental-trip-detail-model.component';

@Component({
  selector: 'app-trip-report',
  templateUrl: './trip-report.component.html',
  styleUrls: ['./trip-report.component.scss']
})
export class TripReportComponent implements OnInit {
  darkTheme = localStorage.getItem('vien-themecolor')
  itemPayment = { label: 'label-title.both', value: '2' };
  itemStatus = { label: 'label-title.both', value: '2' };
  bookingType = { label: 'label-title.all', booking_type: this._helper.REQUEST_TYPE.ALL };
  itemcreatedType = { label: 'menu.user', value: this._helper.CREATED_BY.CREATED_BY_USER };
  itemOptionsPayments = [
    { label: 'label-title.both', value: '2' },
    { label: 'label-title.cash', value: '1' },
    { label: 'label-title.card', value: '0' },
  ];
  itemOptionsStatus = [
    { label: 'label-title.both', value: '2' },
    { label: 'label-title.completed', value: '1' },
    { label: 'label-title.cancelled', value: '0' },
  ];
  bookingTypesList = [
    { label: 'label-title.all', booking_type: this._helper.REQUEST_TYPE.ALL },
    { label: 'label-title.ride-now', booking_type: this._helper.REQUEST_TYPE.RIDE_NOW },
    { label: 'label-title.scheduled', booking_type: this._helper.REQUEST_TYPE.SCHEDULED },
    { label: 'label-title.city-to-city', booking_type: this._helper.REQUEST_TYPE.CITY_TO_CITY },
    { label: 'label-title.rental', booking_type: this._helper.REQUEST_TYPE.RENTAL },
    { label: 'label-title.airport', booking_type: this._helper.REQUEST_TYPE.AIRPORT },
    { label: 'label-title.zone', booking_type: this._helper.REQUEST_TYPE.ZONE },
    { label: 'label-title.guest', booking_type: this._helper.REQUEST_TYPE.GUEST },
    { label: 'label-title.bidding', booking_type: this._helper.REQUEST_TYPE.BIDDING },
    { label: 'label-title.fixed', booking_type: this._helper.REQUEST_TYPE.FIXED },
  ];
  itemcreatedTypesList = [
    { label: 'menu.user', value: this._helper.CREATED_BY.CREATED_BY_USER },
    { label: 'menu.driver', value: this._helper.CREATED_BY.CREATED_BY_PROVIDER },
    { label: 'menu.hotel', value: this._helper.CREATED_BY.CREATED_BY_HOTEL },
    { label: 'menu.dispatcher', value: this._helper.CREATED_BY.CREATED_BY_DISPATCHER },
    { label: 'menu.corporate', value: this._helper.CREATED_BY.CREATED_BY_CORPORATE }
  ];
  todayDate: Date = new Date();
  itemOptionsPerPage = [];
  PROVIDER_STATUS = PROVIDER_STATUS;
  PROVIDER_ACCEPTED = PROVIDER_ACCEPTED;
  TRIP_STATUS = TRIP_STATUS;
  item_bsRangeValue;
  expanded: any = {};
  timeout: any;
  header: any;
  rows = [];
  start_date: string = '';
  end_date: string = '';
  trip_list: any;
  search_value: string = '';
  timezone_for_display_date: string = '';
  panel_type: any;
  panel_type_name: any;
  itemsPerPage = 20;
  current_page: number = 1;
  total_page: number;
  is_excel_sheet: boolean = false;
  darkMode: boolean = false;
  is_clear_disabled: boolean = true;
  country_list: any = [];
  city_list: any = [];
  selectedCountryId: string;
  selectedCityId: string;
  selectedProviderId: string;
  selectedPartnerId: string;
  selectedCorporateId: string;
  selectedServiceTypeId: string;
  provider_list: any = [];
  partner_list: any = [];
  corporate_list: any = [];
  servicetype_list: any = [];
  sort_item: any;
  sort_order: any;
  created_date: Date;
  direction = localStorage.getItem('direction');

  RequestMainType = RequestMainType;

  @Input() requestMainType: string;

  @ViewChild('myTable') table: any;
  @ViewChild('runningModal', { static: true }) runningModal: TripDetailsModalComponent;
  @ViewChild('openRideTripDetailsModal', { static: true }) openRideTripDetailsModal: OpenRideTripDetailsModalComponent;
  @ViewChild('rentalTripDetailsModal', { static: true }) rentalTripDetailsModal: RentalTripDetailModelComponent;
  @ViewChild('ExportHistotyModel', { static: true }) ExportHistotyModel: ExportHistoryModelComponent;

  constructor(private _requestService: RequestService, public _helper: Helper, private _notifierService: NotifiyService, private _countryService: CountryService, private _cityService: CityService, private _mapViewService: MapViewService, private _socket: SocketService) { }

  ngOnDestroy(): void {
    this._helper.selected_id = '';
    this._helper.history_type = '';
  }

  ngOnInit(): void {
    this.panel_type = this._helper.type;
    this.panel_type_name = this._helper.type_name;
    this.getCountryList();
    this.itemOptionsPerPage = this._helper.PER_PAGE_LIST;
    if (this.darkTheme.startsWith('dark')) {
      this.darkMode = true;
    }
    this._helper.display_date_timezone.subscribe(data => {
      this.timezone_for_display_date = data;
    })
    this._helper.created_date.subscribe(data => {
      if (data) {
        let date = new Date(data)
        this.created_date = date;
      }
    })
    this.exportHistorySocket();
  }

  showExportHistoryModal(): void {
    if (this.requestMainType === RequestMainType.OPEN_RIDE) {
      this.ExportHistotyModel.show(TRIP_STATUS.OPEN_RIDE_TRIPS_REPORT, this._helper.user_details._id);
    } else if (this.requestMainType === RequestMainType.RENTAL_RIDE) {
      this.ExportHistotyModel.show(TRIP_STATUS.RENTAL_REQUEST_REPORT, this._helper.user_details._id);
    } else {
      this.ExportHistotyModel.show(TRIP_STATUS.COMPLETED_TRIP_REPORT, this._helper.user_details._id);
    }
  }

  // get CountryList
  getCountryList() {
    this._countryService.fetchCountry().then(res => {
      if (res.success) {
        this.country_list = res.country_list;
        this.selectedCountryId = this.country_list[0]?._id;
        if (this.selectedCountryId) {
          this.getCityList(this.selectedCountryId);
        }
      } else {
        this.selectedCountryId = null;
        this.country_list = []
      }
    })
  }

  // get city from country 
  getCityList(country_Id) {
    this._cityService.fetchDestinationCity({ country_id: country_Id, type: 1 }).then(res => {
      if (res.success) {
        this.city_list = res.destination_list;
        if (this.city_list.length > 0) {
          this.selectedCityId = 'all';
          if (this.selectedCityId) {
            this.vehicleTypeList()
            this.get_corporte_driver_partner_Lists();
          }
        }
      } else {
        this.selectedCityId = null;
        this.city_list = [];
      }
    })
  }

  //get typelist for vehicle and get provider list
  vehicleTypeList() {
    if (this.selectedCityId) {
      let json: any = { country_id: this.selectedCountryId, cityid: this.selectedCityId };
      this._mapViewService.vehicleTypeList(json).then(res => {
        this.servicetype_list = res.type_list;
      })
    } else {
      this.servicetype_list = [];
    }
  }

  get_corporte_driver_partner_Lists() {
    if (this.selectedCityId) {
      let json: any = { country_id: this.selectedCountryId, city_id: this.selectedCityId };
      this._requestService.get_details_country_city_wise_list(json).then(res => {
        if (res.corporate.length > 0) {
          this.corporate_list = res.corporate;
        } else {
          this.corporate_list = [];
        }
        if (res.partner.length > 0) {
          this.partner_list = res.partner;
        } else {
          this.partner_list = [];
        }
        if (res.provider.length > 0) {
          this.provider_list = res.provider;
        } else {
          this.provider_list = [];
        }
      })
    } else {
      this.provider_list = [];
      this.partner_list = [];
      this.corporate_list = [];
    }
  }

  // get country to input field
  getCountry(countryId) {
    this.selectedCountryId = countryId;
    this.getCityList(countryId);
  }

  // get city to input field
  getCity(cityId) {
    this.selectedCityId = cityId;
    this.get_corporte_driver_partner_Lists();
    this.vehicleTypeList();
  }

  getProvider(providerId) {
    this.selectedProviderId = providerId;
    this.is_clear_disabled = false;
  }

  getPartner(partnerId) {
    this.selectedPartnerId = partnerId;
    this.is_clear_disabled = false;
  }

  getCorporate(corporateId) {
    this.selectedCorporateId = corporateId;
    this.is_clear_disabled = false;
  }

  getServiceType(service_type_id) {
    this.selectedServiceTypeId = service_type_id;
    this.is_clear_disabled = false;
  }

  //get completed request list
  async getList() {
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

    let json: any;
    if (this.requestMainType === RequestMainType.OPEN_RIDE) {
      json = {
        is_excel_sheet: this.is_excel_sheet,
        header: this.header,
        export_user_id: this._helper.user_details._id,
        country_id: this.selectedCountryId,
        city_id: this.selectedCityId,
        page: this.current_page,
        limit: this.itemsPerPage,
        user_name: this.search_value,
        driver_id: this.selectedProviderId,
        provider_type_id: this.selectedPartnerId,
        service_type_id: this.selectedServiceTypeId,
        trip_status: this.itemStatus.value,
        start_date: start_date,
        end_date: end_date,
        sort_item: this.sort_item,
        sort_order: this.sort_order,
        type: TRIP_STATUS.OPEN_RIDE_TRIPS_REPORT
      }
    } else if (this.requestMainType === RequestMainType.RENTAL_RIDE) {
      json = {
        is_excel_sheet: this.is_excel_sheet,
        header: this.header,
        export_user_id: this._helper.user_details._id,
        country_id: this.selectedCountryId,
        page: this.current_page,
        limit: this.itemsPerPage,
        user_name: this.search_value,
        driver_id: this.selectedProviderId,
        trip_status: this.itemStatus.value,
        start_date: start_date,
        end_date: end_date,
        sort_item: this.sort_item,
        sort_order: this.sort_order,
        type: TRIP_STATUS.RENTAL_REQUEST_REPORT
      }
    } else {
      json = {
        is_excel_sheet: this.is_excel_sheet,
        header: this.header,
        export_user_id: this._helper.user_details._id,
        country_id: this.selectedCountryId,
        city_id: this.selectedCityId,
        page: this.current_page,
        limit: this.itemsPerPage,
        user_name: this.search_value,
        driver_id: this.selectedProviderId,
        provider_type_id: this.selectedPartnerId,
        user_type_id: this.selectedCorporateId,
        service_type_id: this.selectedServiceTypeId,
        booking_type: this.bookingType.booking_type,
        created_by: this.itemcreatedType.value,
        payment_mode: this.itemPayment.value,
        trip_status: this.itemStatus.value,
        start_date: start_date,
        end_date: end_date,
        sort_item: this.sort_item,
        sort_order: this.sort_order,
        type: TRIP_STATUS.COMPLETED_TRIP_REPORT
      }
    }

    if (this.selectedCityId == "all") {
      delete json.city_id;
    }

    let res: any;
    if (this.requestMainType === RequestMainType.OPEN_RIDE) {
      res = await this._requestService.openRideReportList(json);
    } else if (this.requestMainType === RequestMainType.RENTAL_RIDE) {
      res = await this._requestService.rentalRequestReportList(json);
    } else {
      res = await this._requestService.reportrequestList(json);
    }

    if (res && this.is_excel_sheet === true) {
      this._notifierService.showNotification('success', this._helper.trans.instant('alert.exported-success'));
      this.is_excel_sheet = false;
      return;
    }
    if (res.success) {
      if (res.trip_list.length > 0) {
        this.rows = res.trip_list;
        this.total_page = res.total_page;
      } else {
        this.rows = [];
        this.total_page = 0;
      }
    }
  }

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
    this.getList()
  }

  //open dropdown in media screen
  toggleExpandRow(row): void {
    this.table.rowDetail.toggleExpandRow(row);
  }

  //open modal
  showAddNewModal(id, status): void {
    if (status == 1) {
      if (this.requestMainType === RequestMainType.OPEN_RIDE) {
        this.openRideTripDetailsModal.show(id, TRIP_STATUS.COMPLETED, this.timezone_for_display_date);
      } else if (this.requestMainType === RequestMainType.RENTAL_RIDE) {
        this.rentalTripDetailsModal.show(id, TRIP_STATUS.COMPLETED, this.timezone_for_display_date);
      } else {
        this.runningModal.show(id, TRIP_STATUS.COMPLETED, this.timezone_for_display_date);
      }
    } else {
      if (this.requestMainType === RequestMainType.OPEN_RIDE) {
        this.openRideTripDetailsModal.show(id, TRIP_STATUS.CANCELLED, this.timezone_for_display_date);
      } else if (this.requestMainType === RequestMainType.RENTAL_RIDE) {
        this.rentalTripDetailsModal.show(id, TRIP_STATUS.CANCELLED, this.timezone_for_display_date);
      } else {
        this.runningModal.show(id, TRIP_STATUS.CANCELLED, this.timezone_for_display_date);
      }
    }
  }

  //when change value in serch by dropdown
  onChangeCreatedBy(item): void {
    this.itemcreatedType = item;
    this.is_clear_disabled = false;
  }

  //when change value in bookingtype by dropdown
  onChangeBookingType(item): void {
    this.bookingType = item;
    this.is_clear_disabled = false;
  }

  //when change payment mode
  onChangePayments(item): void {
    this.itemPayment = item;
    this.is_clear_disabled = false;
  }

  //when change trip status 
  onChangeStatus(item): void {
    this.itemStatus = item;
    this.is_clear_disabled = false;
  }

  //when change page limit
  onChangeItemsPerPage(item) {
    if (this.total_page >= this.current_page) {
      this.current_page = 1;
    }
    this.itemsPerPage = item;
    this.getList();
  }

  //when change pagination page
  pageChanged(event) {
    this.current_page = event;
    this.getList();
  }

  //apply filter
  apply() {
    if (this.item_bsRangeValue?.length) {
      this.is_clear_disabled = false;
      this.start_date = this.item_bsRangeValue[0];
      this.end_date = this.item_bsRangeValue[1];
    }
    this.current_page = 1;
    this.getList();
  }

  //clear filter
  clear() {
    if (this.requestMainType === RequestMainType.NORMAL) {
      this.selectedCorporateId = null;
      this.itemPayment = { label: 'label-title.both', value: '2' };
      this.bookingType = { label: 'label-title.all', booking_type: this._helper.REQUEST_TYPE.ALL };
      this.itemcreatedType = { label: 'menu.user', value: this._helper.CREATED_BY.CREATED_BY_USER };
    }
    this.current_page = 1;
    this.itemsPerPage = 20;
    this.selectedProviderId = null;
    this.selectedPartnerId = null;
    this.selectedServiceTypeId = null;
    this.itemStatus = { label: 'label-title.both', value: '2' };
    this.item_bsRangeValue = '';
    this.start_date = '';
    this.end_date = '';
    this.search_value = '';
    this.getList();
    this.is_clear_disabled = true;
  }

  //export
  export() {
    if (this.rows.length != 0) {
      let header = {
        id: this._helper.trans.instant('label-title.trip_id'),
        user_name: this._helper.trans.instant('heading-title.user'),
        driver_name: this._helper.trans.instant('menu.driver'),
        status: this._helper.trans.instant('pages.status'),
        vehicle_name: this._helper.trans.instant('label-title.service-type'),
        date: this._helper.trans.instant('heading-title.date'),
        amount: this._helper.trans.instant('heading-title.amount'),
        payment: this._helper.trans.instant('heading-title.payment'),
        payment_status: this._helper.trans.instant('dashboards.payment-status'),
        title_pay_by_cash: this._helper.trans.instant('label-title.by-cash'),
        title_pay_by_card: this._helper.trans.instant('label-title.by-card'),
        title_pending: this._helper.trans.instant('label-title.pending'),
        title_paid: this._helper.trans.instant('label-title.paid'),
        title_not_paid: this._helper.trans.instant('label-title.not-paid'),
        title_completed: this._helper.trans.instant('label-title.completed'),
        title_cancelled: this._helper.trans.instant('label-title.cancelled'),
        base_price: this._helper.trans.instant('label-title.base-price'),
        distance: this._helper.trans.instant('label-title.distance'),
        distance_price: this._helper.trans.instant('label-title.distance-price'),
        time: this._helper.trans.instant('label-title.time'),
        time_price: this._helper.trans.instant('label-title.time-price'),
        waiting_time: this._helper.trans.instant('label-title.waiting-time'),
        wait_time_price: this._helper.trans.instant('label-title.wait-time-price'),
        user_tax: this._helper.trans.instant('label-title.user-tax'),
        tax: this._helper.trans.instant('label-title.tax'),
        user_miscellaneous_fee: this._helper.trans.instant('label-title.user-miscellaneous-fee'),
        tip: this._helper.trans.instant('label-title.tip'),
        toll: this._helper.trans.instant('label-title.toll'),
        driver_profit: this._helper.trans.instant('label-title.driver-profit'),
        driver_tax: this._helper.trans.instant('label-title.driver-tax'),
        driver_miscellaneous_fee: this._helper.trans.instant('label-title.driver-miscellaneous-fee'),
        pickup_address: this._helper.trans.instant('label-title.pickup-address'),
        destination_address: this._helper.trans.instant('label-title.destination-address'),
        address: this._helper.trans.instant('label-title.address')
      }

      this.header = JSON.stringify(header);
      this.is_excel_sheet = true;
      this.getList();
      setTimeout(() => {
        this.showExportHistoryModal();
      }, 500);
    } else {
      this._notifierService.showNotification('error', this._helper.trans.instant('label-title.no-record-found'));
    }
  }

  exportHistorySocket() {
    this._socket.listener("export_history_socket").subscribe((response: any) => {
      if ((this.requestMainType === RequestMainType.NORMAL && response && response.type == TRIP_STATUS.COMPLETED_TRIP_REPORT) || (this.requestMainType === RequestMainType.OPEN_RIDE && response && response.type == TRIP_STATUS.OPEN_RIDE_TRIPS_REPORT) || (this.requestMainType === RequestMainType.RENTAL_RIDE && response && response.type == TRIP_STATUS.RENTAL_REQUEST_REPORT)) {
        this.showExportHistoryModal();
      }
    })
  }

}

