import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { EditDriverModalComponent } from 'src/app/containers/pages/edit-driver-modal/edit-driver-modal.component';
import { CommonService } from 'src/app/services/common.service';
import { NotifiyService } from 'src/app/services/notifier.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-rent-car-owner',
  templateUrl: './rent-car-owner.component.html',
  styleUrls: ['./rent-car-owner.component.scss']
})
export class RentCarOwnerComponent implements OnInit {
  darkTheme = localStorage.getItem('vien-themecolor')
  itemOrder = { label: 'label-title.id', value: 'unique_id' };
  itemOptionsOrders = [
    { label: 'label-title.id', value: 'unique_id', isShow: true },
    { label: 'label-title.name', value: 'first_name', isShow: true },
    { label: 'label-title.email', value: 'email', isShow: true },
    { label: 'label-title.phone', value: 'phone', isShow: true },
    { label: 'label-title.country', value: 'country', isShow: true },
  ];
  approveModalConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  count: any;
  config: any;
  search_value: any = '';
  item_bsRangeValue;
  start_date: string = '';
  end_date: string = '';
  viewType: number = 1;
  currentPage: number = 1;
  selectedId: string = '';
  filterData = { type: '2', page_no: 1, item_per_page: 15 };
  darkMode: boolean = false;
  isFilterApply: boolean = false;
  is_show_email: boolean = true;
  is_show_phone: boolean = true;
  header: any;
  created_date: Date;
  direction = localStorage.getItem('direction');
  todayDate: Date = new Date();
  searchBy: any = this.itemOrder.value;
  itemsPerPage = 15;
  itemOptionsPerPage = [];
  ownerList: any = [];

  @ViewChild('DriverUserModal', { static: true }) DriverUserModal: EditDriverModalComponent;
  constructor(public _helper: Helper, private _commonService: CommonService, private modalService: BsModalService, private _notifierService: NotifiyService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.itemOptionsPerPage = this._helper.USERS_PER_PAGE_LIST;
    this.filterData['search_item'] = this.searchBy;

    this.getOwnerList(this.filterData);

    this.config = {
      currentPage: this.currentPage,
      itemsPerPage: this.itemsPerPage,
      totalItems: this.count,
    };

    if (this.darkTheme.startsWith('dark')) {
      this.darkMode = true;
    }

    this._helper.created_date.subscribe(data => {
      if (data) {
        let date = new Date(data)
        this.created_date = date;
      }
    })
  }

  // User Data List get after filtering
  getOwnerList(filterData) {
    this._commonService.getRentCarOwnerList(this.filterData).then((res_data: any) => {
      this.ownerList = res_data.type_list;
      this.count = res_data.total_page;
      this.cdr.detectChanges();
      setTimeout(() => {
        if (this.ownerList.length == 0 && this.filterData['page_no'] != 1) {
          this.filterData['page_no'] = 1;
          this.pageChanged(1);
        }
      }, 500);
      this.itemOptionsOrders.forEach((data) => {
        if (data.value == 'email' && res_data.is_show_email === false) {
          data.isShow = false;
        }
        if (data.value == 'phone' && res_data.is_show_phone === false) {
          data.isShow = false;
        }
      })
    });
  }

  // View Change Gride View and List View
  onViewChange(type) {
    this.viewType = type
  }

  onChangeOrderBy(user): void {
    this.isFilterApply = true;
    this.itemOrder = user;
    this.filterData['search_item'] = this.itemOrder.value;
  }

  //Pagination
  pageChanged(event) {
    this.currentPage = event;
    this.filterData['page_no'] = event;
    this.getOwnerList(this.filterData);
  }

  // Items Per page Filter
  onChangeItemsPerPage(item): void {
    this.itemsPerPage = item;
    this.filterData['item_per_page'] = item;
    if (this.count >= this.currentPage) {
      this.currentPage = 1;
      this.filterData['page_no'] = 1;
    }
    this.getOwnerList(this.filterData);
  }

  // Apply Filter on data
  apply(value) {
    this.currentPage = 1;
    this.search_value = value;
    this.filterData['search_value'] = this.search_value;
    this.filterData['page_no'] = 1;
    if (this.item_bsRangeValue?.length) {
      this.start_date = this.item_bsRangeValue[0];
      this.end_date = this.item_bsRangeValue[1];

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

      this.filterData['start_date'] = start_date;
      this.filterData['end_date'] = end_date;
    }

    if (this.search_value != '' || this.start_date != '' || this.isFilterApply) {
      this.getOwnerList(this.filterData);
      this.isFilterApply = true;
    }
  }

  // Clear Filter
  clear() {
    this.currentPage = 1;
    this.filterData['page_no'] = 1;
    this.search_value = ''
    this.filterData['search_value'] = '';
    this.filterData['search_item'] = this.searchBy;
    this.filterData['start_date'] = null;
    this.filterData['end_date'] = null;
    this.itemOrder = { label: 'label-title.id', value: 'unique_id' };
    this.isFilterApply = false;
    this.item_bsRangeValue = '';
    this.start_date = '';
    this.end_date = '';
    this.getOwnerList(this.filterData);
  }

  export() {
    if (this.ownerList.length != 0) {

      let header = {
        id: this._helper.trans.instant('label-title.id'),
        name: this._helper.trans.instant('heading-title.name'),
        email: this._helper.trans.instant('user.email'),
        phone: this._helper.trans.instant('heading-title.phone'),
        country: this._helper.trans.instant('menu.country'),
      }

      this.header = JSON.stringify(header);
      this.filterData['header'] = this.header;
      this.filterData['is_excel_sheet'] = true;

      this._commonService.getRentCarOwnerList(this.filterData).then((res: any) => {
        this._helper.downloadFile(res.url);
        this.filterData['is_excel_sheet'] = null;
        this.header = '';
      });
    } else {
      this._notifierService.showNotification('error', this._helper.trans.instant('label-title.no-record-found'));
    }
  }

  // Edit Driver Model open
  showDriverModal(event,driver_id): void {
    if(!event || event.target.tagName.toLowerCase() !== 'button'){
      this.DriverUserModal.show(driver_id, this.filterData.type, false, true);
    }
  }

}
