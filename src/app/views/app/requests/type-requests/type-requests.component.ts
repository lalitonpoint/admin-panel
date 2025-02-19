import { NotifiyService } from 'src/app/services/notifier.service';
import { RequestService } from 'src/app/services/request.service';
import { Helper } from '../../../../shared/helper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PROVIDER_ACCEPTED, PROVIDER_STATUS, TRIP_STATUS } from 'src/app/constants/constants';
import { TripDetailsModalComponent } from 'src/app/containers/pages/trip-details-modal/trip-details-modal.component';
import { ExportHistoryModelComponent } from 'src/app/containers/pages/export-history-model/export-history-model.component';
import { SocketService } from 'src/app/services/sockert.service';

@Component({
  selector: 'app-type-requests',
  templateUrl: './type-requests.component.html',
  styleUrls: ['./type-requests.component.scss']
})
export class TypeRequestsComponent implements OnInit {
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
  itemSearch = { label: 'label-title.user_name', value: 'user_detail.first_name' };
  itemPayment = { label: 'label-title.both', value: '2' };
  itemOptionsSearch = [
    { label: 'label-title.id', value: 'unique_id' },
    { label: 'label-title.user_name', value: 'user_detail.first_name' },
    { label: 'label-title.driver_name', value: 'provider_details.first_name' },
    { label: 'label-title.service_type', value: 'vehicle_details.typename' },
  ];
  itemOptionsPayments = [
    { label: 'label-title.both', value: '2' },
    { label: 'label-title.cash', value: '1' },
    { label: 'label-title.card', value: '0' },
  ];
  todayDate: Date = new Date();
  itemOptionsPerPage = [20, 50, 100];
  PROVIDER_STATUS = PROVIDER_STATUS;
  PROVIDER_ACCEPTED = PROVIDER_ACCEPTED;
  TRIP_STATUS = TRIP_STATUS;
  item_bsRangeValue;
  expanded: any = {};
  timeout: any;
  rows = [];
  start_date: any = '';
  end_date: any = '';
  trip_list: any;
  search_value: string = '';
  timezone_for_display_date:string = '';
  user_type : any ;
  panel_type : any ;
  panel_type_name : any ;
  itemsPerPage = 20;
  current_page: number = 1;
  total_page: number;
  is_excel_sheet: boolean = false;
  darkMode:boolean=false;
  is_clear_disabled:boolean = true;
  sort_item: any;
  sort_order: any;
  created_date:Date;
  direction = localStorage.getItem('direction');
  history_type:number;

  @ViewChild('myTable') table: any;
  @ViewChild('runningModal', { static: true }) runningModal: TripDetailsModalComponent;
  @ViewChild('ExportHistotyModel', { static: true }) ExportHistotyModel: ExportHistoryModelComponent;

  constructor(public _helper : Helper , private requestService : RequestService , private _notifierService : NotifiyService,private _socket:SocketService) { }

  ngOnInit(): void {
    this.user_type = JSON.parse(localStorage.getItem('historyData')) ;
    let history = `${window.location}`?.split('/').pop();
    if(history == 'open_ride_history'){
      this.history_type = this._helper.OPEN_HISTORY_TYPE.OPEN_RIDE;
    }else{
      this.history_type = this._helper.OPEN_HISTORY_TYPE.NORMAL;
    }
    this.getList();
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
    this.exportHistorySocket();
  }

  showExportHistoryModal(): void {
    this.ExportHistotyModel.show(Number(this.user_type.export_request_type),this._helper.user_details._id) ;
  }

  getList(){
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
    let json : any = {
      user_type_id : this.user_type._id,
      type : this.user_type.type ,
      limit : this.itemsPerPage,
      payment_mode: this.itemPayment.value ,
      is_excel_sheet :  this.is_excel_sheet ,
      start_date: start_date,
      end_date: end_date,
      search_by: this.itemSearch.value,
      search_value: this.search_value,
      sort_item : this.sort_item,
      sort_order : this.sort_order ,
      page : this.current_page ,
      export_history_type : this.user_type.export_request_type,
      export_user_id:this._helper.user_details._id
    }
    this.requestService.getServieceTypeTripList(json).then((res_data)=>{
      if(res_data){
        if (res_data.success && this.is_excel_sheet === true) {
          this._notifierService.showNotification('success', this._helper.trans.instant('alert.exported-success'));
          this.is_excel_sheet = false;
          return;
        }
        if (res_data.success) {
          if (res_data.trip_list.length > 0) {
            this.rows = res_data.trip_list[0].data;
            this.total_page = res_data.trip_list[0].total;
          } else {
            this.rows = [];
            this.total_page = 0;
          }
        }
      }

    })
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
    this.getList()
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
    if(this.total_page >= this.current_page){
      this.current_page = 1;
    }
    this.itemsPerPage = item;
    this.getList();
  }

  pageChanged(event) {
    this.current_page = event;
    this.getList();
  }

  apply() {
    if (this.item_bsRangeValue?.length) {
      this.is_clear_disabled = false;
      this.start_date = this.item_bsRangeValue[0];
      this.end_date = this.item_bsRangeValue[1];
    }
    this.current_page = 1;
    this.getList();
  }

  clear(){
    this.item_bsRangeValue = '';
    this.start_date = '';
    this.end_date = '';
    this.search_value = '';
    this._helper.history_type = '';
    this.itemSearch = { label: 'label-title.user_name', value: 'user_detail.first_name' };
    this.itemPayment = { label: 'label-title.both', value: '2' };
    this.current_page = 1;
    this.panel_type = '' ;
    this.panel_type_name = '' ;
    this.itemsPerPage = 20;
    this.getList();
    this.is_clear_disabled = true;
  }

  showAddNewModal(trip): void {
    if(trip.is_trip_cancelled == 1){
      this.runningModal.show(trip._id, TRIP_STATUS.CANCELLED,this.timezone_for_display_date);
    }else{
      this.runningModal.show(trip._id, TRIP_STATUS.COMPLETED,this.timezone_for_display_date);
    }
  }

  toggleExpandRow(row): void {
    this.table.rowDetail.toggleExpandRow(row);
  }

  export(){
    if(this.rows.length != 0){
      let header;
      header = {
        id : this._helper.trans.instant('label-title.trip_id'),
        user_id : this._helper.trans.instant('label-title.user-id'),
        user : this._helper.trans.instant('heading-title.user'),
        driver_id : this._helper.trans.instant('heading-title.driver-id'),
        driver : this._helper.trans.instant('menu.driver'),
        date : this._helper.trans.instant('heading-title.date'),
        status : this._helper.trans.instant('pages.status'),
        amount : this._helper.trans.instant('heading-title.amount'),
        payment : this._helper.trans.instant('heading-title.payment'),
        payment_status : this._helper.trans.instant('dashboards.payment-status'),
        title_trip_status_completed : this._helper.trans.instant('label-title.completed'),
        title_pay_by_cash : this._helper.trans.instant('label-title.by-cash'),
        title_pay_by_card : this._helper.trans.instant('label-title.by-card'),
        title_pending :  this._helper.trans.instant('label-title.pending'),
        title_paid :  this._helper.trans.instant('label-title.paid'),
        title_total_cancelled: this._helper.trans.instant('label-title.cancelled'),
        title_status_cancel_by_provider: this._helper.trans.instant('label-title.cancel-by-provider'),
        title_status_cancel_by_user: this._helper.trans.instant('label-title.cancel-by-user'),
        title_trip_status_coming: this._helper.trans.instant('label-title.coming'),
        title_trip_status_arrived: this._helper.trans.instant('label-title.arrived'),
        title_trip_status_trip_started: this._helper.trans.instant('label-title.started'),
        title_trip_status_accepted: this._helper.trans.instant('label-title.accepted'),
        title_trip_status_waiting: this._helper.trans.instant('label-title.waiting'),
        title_not_paid: this._helper.trans.instant('label-title.not-paid')
      }

      header = JSON.stringify(header);
      console.log(header);
      this.is_excel_sheet = true;
      this.getList();
      setTimeout(() => {
        this.showExportHistoryModal();
      }, 500);

    }else{
      this._notifierService.showNotification('error', this._helper.trans.instant('label-title.no-record-found'));
    }
  }

  exportHistorySocket(){
    this._socket.listener("export_history_socket").subscribe((response:any) => {
      if(response && response.type == Number(this.user_type.export_request_type)){
        this.showExportHistoryModal();
      }
    })
  }

}
