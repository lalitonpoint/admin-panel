import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TripDetailsModalComponent } from 'src/app/containers/pages/trip-details-modal/trip-details-modal.component';
import { RequestService } from 'src/app/services/request.service';
import { PROVIDER_STATUS, PROVIDER_ACCEPTED, TRIP_STATUS, RequestSubType, RequestMainType, RENTAL_TRIP_STATUS } from 'src/app/constants/constants';
import { Column, Helper } from 'src/app/shared/helper';
import { ExportHistoryModelComponent } from 'src/app/containers/pages/export-history-model/export-history-model.component';
import { SocketService } from 'src/app/services/sockert.service';
import { NotifiyService } from 'src/app/services/notifier.service';
import { OpenRideTripDetailsModalComponent } from '../open-ride-trip-details-modal/open-ride-trip-details-modal.component';
import { RentalTripDetailModelComponent } from '../rental-trip-detail-model/rental-trip-detail-model.component';

@Component({
  selector: 'app-trip-request',
  templateUrl: './trip-request.component.html',
  styleUrls: ['./trip-request.component.scss']
})
export class TripRequestComponent implements OnInit, OnDestroy {
  darkTheme = localStorage.getItem('vien-themecolor')
  columns = [
    { prop: 'title', name: 'Title' },
    { prop: 'user', name: 'User' },
    { prop: 'driver', name: 'Driver' },
    { prop: 'service', name: 'Service' },
    { prop: 'price', name: 'Price' },
    { prop: 'status', name: 'Status' },
    { prop: 'payment', name: 'Payment' },
    { prop: 'time', name: 'Time' },
  ];
  itemSearch = { label: 'label-title.user_name', value: 'user_details.first_name' };
  itemPayment = { label: 'label-title.both', value: '2' };
  itemOptionsSearch = [
    { label: 'label-title.id', value: 'unique_id' },
    { label: 'label-title.user_name', value: 'user_details.first_name' },
    { label: 'label-title.driver_name', value: 'provider_details.first_name' },
    { label: 'label-title.service_type', value: 'vehicle_type_details.typename' },
  ];
  itemOptionsPayments = [
    { label: 'label-title.both', value: '2' },
    { label: 'label-title.cash', value: '1' },
    { label: 'label-title.card', value: '0' },
  ];
  itemOptionsTabs = [];
  allColumns: Column[] = [
    { key: "unique_id", label: this._helper.trans.instant("label-title.trip_id"), isSort: true },
    { key: "provider_details", label: this._helper.trans.instant("label-title.driver") },
    { key: "vehicle_details.typename", label: this._helper.trans.instant("label-title.service"), isSort: true },
    { key: "total", label: this._helper.trans.instant("label-title.price"), isSort: true },
    { key: "user_create_time", label: this._helper.trans.instant("label-title.create-time"), isSort: true, isDate: true },
  ]

  booking_type: number = 0;
  todayDate: Date = new Date();
  itemOptionsPerPage = [];
  PROVIDER_STATUS = PROVIDER_STATUS;
  PROVIDER_ACCEPTED = PROVIDER_ACCEPTED;
  TRIP_STATUS = TRIP_STATUS;
  RENTAL_TRIP_STATUS = RENTAL_TRIP_STATUS;
  item_bsRangeValue;
  expanded: any = {};
  header: any;
  timeout: any;
  rows = [];
  start_date: any;
  end_date: any;
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
  sort_item: any;
  sort_order: any;
  created_date: Date;
  direction = localStorage.getItem('direction');

  RequestMainType = RequestMainType;
  RequestSubType = RequestSubType;

  @Input() requestMainType: string;
  @Input() requestSubType: string;

  @ViewChild('myTable') table: any;
  @ViewChild('runningModal', { static: true }) runningModal: TripDetailsModalComponent;
  @ViewChild('openRideTripDetailsModal', { static: true }) openRideTripDetailsModal: OpenRideTripDetailsModalComponent;
  @ViewChild('rentalTripDetailsModal', { static: true }) rentalTripDetailsModal: RentalTripDetailModelComponent;
  @ViewChild('ExportHistotyModel', { static: true }) ExportHistotyModel: ExportHistoryModelComponent;

  constructor(private _requestService: RequestService, public _helper: Helper, private _notifierService: NotifiyService, private _socket: SocketService) { }

  ngOnDestroy(): void {
    this._helper.selected_id = '';
    this._helper.history_type = '';
  }

  ngOnInit(): void {
    this.panel_type = this._helper.type;
    this.panel_type_name = this._helper.type_name;

    if (this.requestSubType === RequestSubType.COMPLETED || this.requestSubType === RequestSubType.CANCELLED || this.requestSubType === RequestSubType.RUNNING) {
      const sixDaysAgo = new Date(new Date());
      sixDaysAgo.setDate(new Date().getDate() - 6);
      this.start_date = sixDaysAgo;
    } else {
      this.start_date = new Date();
    }

    if (this.requestSubType === RequestSubType.SCHEDULED) {
      const sixDaysAfter = new Date(new Date());
      sixDaysAfter.setDate(new Date().getDate() + 6);
      this.end_date = sixDaysAfter;
    } else {
      this.end_date = new Date();
    }

    this.manageColumns();
    this.manageItemOptionsTabs();
    this.getList();

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
    let exportHistoryType: any = this.getRequestType();
    this.ExportHistotyModel.show(exportHistoryType, this._helper.user_details._id);
  }

  getRequestType(): any {
    switch (this.requestMainType) {
      case RequestMainType.NORMAL:
        return this.getNormalRequesType();
      case RequestMainType.OPEN_RIDE:
        return this.getOpenRideRequesType();
      case RequestMainType.RENTAL_RIDE:
        return this.getRentalRideRequesType();
      default:
        return null;
    }
  }

  getNormalRequesType(): any {
    switch (this.requestSubType) {
      case RequestSubType.RUNNING:
        return TRIP_STATUS.RUNNING;
      case RequestSubType.COMPLETED:
        return TRIP_STATUS.COMPLETED;
      case RequestSubType.CANCELLED:
        return TRIP_STATUS.CANCELLED;
      case RequestSubType.SCHEDULED:
        return TRIP_STATUS.SCHEDULED;
      default:
        return null;
    }
  }

  getOpenRideRequesType(): any {
    switch (this.requestSubType) {
      case RequestSubType.RUNNING:
        return TRIP_STATUS.OPEN_RIDE_RUNNING_TRIP;
      case RequestSubType.COMPLETED:
        return TRIP_STATUS.OPEN_RIDE_COMPLETED_TRIP;
      case RequestSubType.CANCELLED:
        return TRIP_STATUS.OPEN_RIDE_CANCELLED_TRIP;
      case RequestSubType.SCHEDULED:
        return TRIP_STATUS.OPEN_RIDE_SCHEDULED_TRIP;
      default:
        return null;
    }
  }

  getRentalRideRequesType(): any {
    switch (this.requestSubType) {
      case RequestSubType.RUNNING:
        return TRIP_STATUS.RENTAL_RUNNING_REQUEST;
      case RequestSubType.COMPLETED:
        return TRIP_STATUS.RENTAL_COMPLETED_REQUEST;
      case RequestSubType.CANCELLED:
        return TRIP_STATUS.RENTAL_CANCELLED_REQUEST;
      default:
        return null;
    }
  }

  manageColumns(): void {
    switch (this.requestMainType) {
      case RequestMainType.NORMAL:
        this.manageNormalRequestsColumns();
        break;
      case RequestMainType.OPEN_RIDE:
        this.manageOpenRideRequestsColumns();
        break;
      case RequestMainType.RENTAL_RIDE:
        this.manageRentalRideRequestsColumns();
        break;
      default:
        break;
    }
  }

  manageNormalRequestsColumns(): void {
    switch (this.requestSubType) {
      case RequestSubType.RUNNING:
        this.allColumns.splice(1, 0, { key: "user_details.first_name", label: this._helper.trans.instant("label-title.user") });
        this.allColumns.splice(5, 0, { key: "is_provider_status", label: this._helper.trans.instant("label-title.status"), isSort: true });
        this.allColumns.splice(6, 0, { key: "payment_mode", label: this._helper.trans.instant("label-title.payment"), isSort: true });
        this.allColumns.splice(7, 0, { key: "payment_status", label: this._helper.trans.instant("label-title.payment-status"), isSort: true });
        break;
      case RequestSubType.COMPLETED:
        this.allColumns.splice(1, 0, { key: "user_details.first_name", label: this._helper.trans.instant("label-title.user") });
        this.allColumns.splice(5, 0, { key: "payment_mode", label: this._helper.trans.instant("label-title.payment"), isSort: true });
        this.allColumns.splice(6, 0, { key: "payment_status", label: this._helper.trans.instant("label-title.payment-status"), isSort: true });
        this.allColumns.splice(8, 0, { key: "complete_date_in_city_timezone", label: this._helper.trans.instant("label-title.end-time"), isSort: true, isDate: true });
        break;
      case RequestSubType.CANCELLED:
        this.allColumns.splice(1, 0, { key: "user_details.first_name", label: this._helper.trans.instant("label-title.user") });
        this.allColumns.splice(5, 0, { key: "is_provider_status", label: this._helper.trans.instant("label-title.status"), isSort: true });
        this.allColumns.splice(6, 0, { key: "payment_mode", label: this._helper.trans.instant("label-title.payment"), isSort: true });
        this.allColumns.splice(7, 0, { key: "payment_status", label: this._helper.trans.instant("label-title.payment-status"), isSort: true });
        this.allColumns.splice(9, 0, { key: "complete_date_in_city_timezone", label: this._helper.trans.instant("label-title.end-time"), isSort: true, isDate: true });
        break;
      case RequestSubType.SCHEDULED:
        this.allColumns.splice(1, 0, { key: "user_details.first_name", label: this._helper.trans.instant("label-title.user") });
        this.allColumns.splice(5, 0, { key: "payment_mode", label: this._helper.trans.instant("label-title.payment"), isSort: true });
        this.allColumns.splice(7, 0, { key: "server_start_time_for_schedule", label: this._helper.trans.instant("label-title.scheduled-time"), isSort: true, isDate: true });
        break;

      default:
        break;
    }
  }

  manageOpenRideRequestsColumns(): void {
    switch (this.requestSubType) {
      case RequestSubType.RUNNING:
        this.allColumns.splice(4, 0, { key: "is_provider_status", label: this._helper.trans.instant("label-title.status"), isSort: true });
        break;
      case RequestSubType.COMPLETED:
        this.allColumns.splice(5, 0, { key: "complete_date_in_city_timezone", label: this._helper.trans.instant("label-title.end-time"), isSort: true, isDate: true });
        break;
      case RequestSubType.CANCELLED:
        this.allColumns.splice(4, 0, { key: "is_provider_status", label: this._helper.trans.instant("label-title.status"), isSort: true });
        this.allColumns.splice(6, 0, { key: "complete_date_in_city_timezone", label: this._helper.trans.instant("label-title.end-time"), isSort: true, isDate: true });
        break;
      case RequestSubType.SCHEDULED:
        this.allColumns.splice(5, 0, { key: "server_start_time_for_schedule", label: this._helper.trans.instant("label-title.scheduled-time"), isSort: true, isDate: true });
        break;

      default:
        break;
    }
  }

  manageRentalRideRequestsColumns(): void {
    switch (this.requestSubType) {
      case RequestSubType.RUNNING:
        this.allColumns.splice(1, 0, { key: "user_details.first_name", label: this._helper.trans.instant("label-title.user") });
        this.allColumns.splice(5, 0, { key: "status", label: this._helper.trans.instant("label-title.status"), isSort: true });
        this.allColumns.splice(6, 0, { key: "payment_status", label: this._helper.trans.instant("label-title.payment-status"), isSort: true });
        break;
      case RequestSubType.COMPLETED:
        this.allColumns.splice(1, 0, { key: "user_details.first_name", label: this._helper.trans.instant("label-title.user") });
        this.allColumns.splice(6, 0, { key: "complete_date_in_city_timezone", label: this._helper.trans.instant("label-title.end-time"), isSort: true, isDate: true });
        break;
      case RequestSubType.CANCELLED:
        this.allColumns.splice(1, 0, { key: "user_details.first_name", label: this._helper.trans.instant("label-title.user") });
        this.allColumns.splice(5, 0, { key: "status", label: this._helper.trans.instant("label-title.status"), isSort: true });
        this.allColumns.splice(6, 0, { key: "complete_date_in_city_timezone", label: this._helper.trans.instant("label-title.end-time"), isSort: true, isDate: true });
        break;
      default:
        break;
    }
  }

  manageItemOptionsTabs(): void {
    switch (this.requestMainType) {
      case RequestMainType.NORMAL:
        this.manageNornalRequestsItemOptionsTabs();
        break;
      case RequestMainType.RENTAL_RIDE:
        this.manageRentalRideItemOptionsTabs();
        break;
      default:
        break;
    }
  }

  manageNornalRequestsItemOptionsTabs(): void {
    switch (this.requestSubType) {
      case RequestSubType.RUNNING:
        this.itemOptionsTabs = [
          { label: 'label-title.all', booking_type: this._helper.REQUEST_TYPE.ALL },
          { label: 'label-title.ride-now', booking_type: this._helper.REQUEST_TYPE.RIDE_NOW },
          { label: 'label-title.scheduled', booking_type: this._helper.REQUEST_TYPE.SCHEDULED },
          { label: 'label-title.rental', booking_type: this._helper.REQUEST_TYPE.RENTAL },
          { label: 'label-title.bidding', booking_type: this._helper.REQUEST_TYPE.BIDDING },
          { label: 'label-title.fixed', booking_type: this._helper.REQUEST_TYPE.FIXED },
          { label: 'home-page.ride-share', booking_type: this._helper.REQUEST_TYPE.RIDE_SHARE },
        ];
        break;
      case RequestSubType.COMPLETED:
      case RequestSubType.CANCELLED:
        this.itemOptionsTabs = [
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
          { label: 'home-page.ride-share', booking_type: this._helper.REQUEST_TYPE.RIDE_SHARE },
        ];
        break;
      case RequestSubType.SCHEDULED:
        this.itemOptionsTabs = [
          { label: 'label-title.all', booking_type: this._helper.REQUEST_TYPE.ALL },
          { label: 'label-title.fixed', booking_type: this._helper.REQUEST_TYPE.FIXED },
        ];
        break;

      default:
        break;
    }
  }

  manageRentalRideItemOptionsTabs(): void {
    switch (this.requestSubType) {
      case RequestSubType.RUNNING:
        this.itemOptionsTabs = [
          { label: 'label-title.pending', booking_type: this._helper.RENTAL_REQUEST_TYPE.PENDING },
          { label: 'label-title.upcoming', booking_type: this._helper.RENTAL_REQUEST_TYPE.UPCOMING },
          { label: 'label-title.ongoing', booking_type: this._helper.RENTAL_REQUEST_TYPE.ONGOING }
        ];
        break;
      default:
        break;
    }
  }

  getNestedValue(obj: any, key: string): any {
    // Split the key by '.' to get individual properties
    const bookingKeys = key.split(".");

    // Reduce the keys to access the nested value
    return bookingKeys.reduce((acc, curr) => {
      if (curr === "first_name") {
        return `${acc["first_name"]} ${acc["last_name"]}`;
      }
      if (acc && acc[curr] !== undefined) {
        return acc[curr];
      }
      return undefined;
    }, obj);
  }

  getProviderName(data): any {
    if (this.requestMainType === RequestMainType.OPEN_RIDE) {
      if (data.provider_details.length > 0) {
        return `${data.provider_details[0].first_name} ${data.provider_details[0].last_name}`;
      } else {
        return '--';
      }
    } else {
      if (data.provider_details) {
        if(data.provider_details.first_name != '' && data.provider_details.last_name != ''){
          return `${data.provider_details.first_name} ${data.provider_details.last_name}`;
        } else {
          return '--';
        }
      } else {
        return '--';
      }
    }
  }

  //get running request list
  async getList() {
    if (this._helper.selected_id == '') {
      let start_date: any;
      if (this.start_date) {
        this.start_date.setHours(0, 0, 0, 0);
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
      this.item_bsRangeValue = [this.start_date, this.end_date];
      let json: any = {
        type: this.getRequestType(),
        page: this.current_page,
        limit: this.itemsPerPage,
        start_date: start_date,
        end_date: end_date,
        search_by: this.itemSearch.value,
        search_value: this.search_value,
        payment_mode: this.itemPayment.value,
        is_excel_sheet: this.is_excel_sheet,
        sort_item: this.sort_item,
        sort_order: this.sort_order,
        header: this.header,
        export_user_id: this._helper.user_details._id,
        booking_type: this.booking_type
      }

      let res: any;

      if (this.requestMainType === RequestMainType.NORMAL) {
        res = await this._requestService.requestList(json)
      } else if (this.requestMainType === RequestMainType.OPEN_RIDE) {
        res = await this._requestService.openRideRequestList(json)
      } else if (this.requestMainType === RequestMainType.RENTAL_RIDE){
        res = await this._requestService.requestRentalList(json)
      }

      if (res && this.is_excel_sheet === true) {
        this._notifierService.showNotification('success', this._helper.trans.instant('alert.exported-success'));
        this.is_excel_sheet = false;
        this.header = '';
        return;
      }
      this.is_excel_sheet = false;
      if (res.success) {
        if (res.trip_list.length > 0) {
          this.rows = res.trip_list[0].data;
          this.total_page = res.trip_list[0].total;
        } else {
          this.rows = [];
          this.total_page = 0;
        }
      }
    }

    if (this._helper.selected_id != '') {
      let json: any = {
        type: TRIP_STATUS.COMPLETED,
        page: this.current_page,
        limit: this.itemsPerPage,
        user_type_id: this._helper.selected_id,
        user_type: this._helper.history_type,
        payment_mode: this.itemPayment.value,
        is_excel_sheet: this.is_excel_sheet,
        start_date: this.start_date,
        end_date: this.end_date,
        search_by: this.itemSearch.value,
        search_value: this.search_value,
        sort_item: this.sort_item,
        sort_order: this.sort_order,
        header: this.header
      }
      this._requestService.requestList(json).then((res) => {
        if (res && this.is_excel_sheet === true) {
          this._notifierService.showNotification('success', this._helper.trans.instant('alert.exported-success'));
          this.is_excel_sheet = false;
        }
        if (res.trip_list.length > 0) {
          this.rows = res.trip_list[0].data;
          this.total_page = res.trip_list[0].total;
        } else {
          this.rows = [];
          this.total_page = 0;
        }
      })
    }
  }

  //open dropdown in media screen
  toggleExpandRow(row): void {
    this.table.rowDetail.toggleExpandRow(row);
  }

  // open trip invoice modal
  showAddNewModal(id): void {
    if (this.requestMainType === RequestMainType.OPEN_RIDE) {
      this.openRideTripDetailsModal.show(id, this.getRequestType());
    } else if (this.requestMainType === RequestMainType.RENTAL_RIDE) {
      this.rentalTripDetailsModal.show(id, this.getRequestType(), this.timezone_for_display_date, true );
    } else {
      this.runningModal.show(id, this.getRequestType(), this.timezone_for_display_date);
    }
  }

  //when change value in serch by dropdown
  onChangeSearchBy(item): void {
    this.itemSearch = item;
    this.is_clear_disabled = false;
  }

  //when change payment mode
  onChangePayments(item): void {
    this.itemPayment = item;
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
    if (this.requestSubType === RequestSubType.COMPLETED || this.requestSubType === RequestSubType.CANCELLED) {
      const sixDaysAgo = new Date(new Date());
      sixDaysAgo.setDate(new Date().getDate() - 6);
      this.start_date = sixDaysAgo;
    } else {
      this.start_date = new Date();
    }
    this.end_date = new Date();
    this.item_bsRangeValue = [this.start_date, this.end_date];
    this.search_value = '';
    this._helper.selected_id = '';
    this._helper.history_type = '';
    this.itemSearch = { label: 'label-title.user_name', value: 'user_details.first_name' };
    this.itemPayment = { label: 'label-title.both', value: '2' };
    this.current_page = 1;
    this.panel_type = '';
    this.panel_type_name = '';
    this.itemsPerPage = 20;
    this.getList();
    this.is_clear_disabled = true;
  }

  //export
  export() {
    if (this.rows.length != 0) {
      let header = {
        id: this._helper.trans.instant('label-title.trip_id'),
        user_id: this._helper.trans.instant('label-title.user-id'),
        user: this._helper.trans.instant('heading-title.user'),
        driver_id: this._helper.trans.instant('heading-title.driver-id'),
        driver: this._helper.trans.instant('menu.driver'),
        date: this._helper.trans.instant('heading-title.date'),
        status: this._helper.trans.instant('pages.status'),
        amount: this._helper.trans.instant('heading-title.amount'),
        payment: this._helper.trans.instant('heading-title.payment'),
        payment_status: this._helper.trans.instant('dashboards.payment-status'),
        title_trip_status_completed: this._helper.trans.instant('label-title.completed'),
        title_pay_by_cash: this._helper.trans.instant('label-title.by-cash'),
        title_pay_by_card: this._helper.trans.instant('label-title.by-card'),
        title_pending: this._helper.trans.instant('label-title.pending'),
        title_paid: this._helper.trans.instant('label-title.paid'),
        title_total_cancelled: this._helper.trans.instant('label-title.cancelled'),
        title_status_cancel_by_provider: this._helper.trans.instant('label-title.cancel-by-provider'),
        title_status_cancel_by_user: this._helper.trans.instant('label-title.cancel-by-user'),
        title_trip_status_coming: this._helper.trans.instant('label-title.coming'),
        title_trip_status_arrived: this._helper.trans.instant('label-title.arrived'),
        title_trip_status_trip_started: this._helper.trans.instant('label-title.started'),
        title_trip_status_accepted: this._helper.trans.instant('label-title.accepted'),
        title_trip_status_waiting: this._helper.trans.instant('label-title.waiting'),
        title_trip_status_created: this._helper.trans.instant('label-title.created'),
        title_not_paid: this._helper.trans.instant('label-title.not-paid')
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

  getRequestData(type) {
    this.booking_type = type;
    this.apply()
  }

  exportHistorySocket() {
    this._socket.listener("export_history_socket").subscribe((response: any) => {
      if (response && response.type == this.getRequestType()) {
        this.showExportHistoryModal();
      }
    })
  }

}