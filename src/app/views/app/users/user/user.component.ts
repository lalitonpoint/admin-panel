import { NotifiyService } from './../../../../services/notifier.service';
import { Subscription } from 'rxjs';
import { PANEL_TYPE } from './../../../../constants/constants';
import { CommonService } from 'src/app/services/common.service';
import { Helper } from 'src/app/shared/helper';
import { UserService, user_page_type } from './../../../../services/user.service';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UserModelComponent } from 'src/app/containers/pages/user-model/user-model.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  darkTheme = localStorage.getItem('vien-themecolor')
  itemOrder = { label: 'label-title.id', value: 'unique_id' };
  itemOptionsOrders = [
    { label: 'label-title.id', value: 'unique_id', isShow: true },
    { label: 'label-title.name', value: 'first_name', isShow: true },
    { label: 'label-title.email', value: 'email', isShow: true },
    { label: 'label-title.phone', value: 'phone', isShow: true },
    { label: 'label-title.country', value: 'country', isShow: true },
  ];
  OptionUserType = { label: 'label-title.all', value: 'all' }
  userTypeOption = [
    { label: 'label-title.all', value: 'all', isShow: true },
    { label: 'label-title.normal', value: '0', isShow: true },
    { label: 'label-title.corporate', value: '1', isShow: true },
  ];
  approveModalConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  approveModelRef: BsModalRef;
  userObservable: Subscription;
  notificationObservable: Subscription;
  filterData = { type: '', page_no: 1, item_per_page: 15 };
  data: any;
  userList: any = [];
  user_id: any;
  user_page_type: any = user_page_type;
  count: any;
  status: any = user_page_type.approved;
  approvalStatus: any;
  search_value: any = '';
  selectedUser: any;
  searchBy: any = this.itemOrder.value;
  viewType: number = 1;
  currentPage: number = 1;
  PANEL_TYPE = PANEL_TYPE;
  config: any;
  manualTrigger = false;
  darkMode: boolean = false;
  isFilterApply: boolean = false;
  is_show_email: boolean = true;
  is_show_phone: boolean = true;
  header: any;
  corporateData: any = {};
  created_date: Date;
  direction = localStorage.getItem('direction');
  todayDate: Date = new Date();
  item_bsRangeValue;
  start_date: string = '';
  end_date: string = '';
  selectedId: string = '';
  tabType: number;
  is_notification = false;
  userType: any = this.OptionUserType.value;
  itemsPerPage = 15;
  itemOptionsPerPage = [];

  @ViewChild('search') search: any;
  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;
  @ViewChild('UserListModal', { static: true }) displayOptionsCollapsed = false;
  @ViewChild('UserListModal', { static: true }) UserListModal: UserModelComponent;
  @ViewChild('approveTemplate', { static: true }) approveTemplate: TemplateRef<any>;

  constructor(public _helper: Helper, private userService: UserService, private _commonService: CommonService, private modalService: BsModalService, private _notifierService: NotifiyService, private cdr: ChangeDetectorRef) { }

  async ngOnInit(): Promise<void> {
    this.itemOptionsPerPage = this._helper.USERS_PER_PAGE_LIST;
    this.filterData['type'] = this.PANEL_TYPE.USER;
    this.filterData['search_item'] = this.searchBy;
    this.filterData['user_type'] = this.userType;
    this.filterData['is_approved'] = this.status;

    this.notificationObservable = this._helper.notification_detail.subscribe(notification => {
      if (notification) {
        this.selectTab(0)
        this.redirect_from_notification(notification.user_unique_id)
        this.showUserModal(null, notification.user_id)
      } else if (this._helper.selected_id == '') {
        this.userObservable = this._commonService._userObservable.subscribe(() => {
          this.getUserList(this.filterData);
        })
      } else {
        this.selectedId = this._helper.selected_id;
        this.corporateData = JSON.parse(localStorage.getItem('historyData'));

        this.filterData['corporate_id'] = this._helper.selected_id;
        this.userObservable = this._commonService._userObservable.subscribe(() => {
          this.getUserList(this.filterData);
        })
      }
    })

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

  selectTab(tabId: number) {
    this.tabType = tabId;
    if (this.staticTabs?.tabs[tabId]) {
      this.staticTabs.tabs[tabId].active = true;
    }
  }

  redirect_from_notification(unique_id): void {
    this.searchBy = "unique_id"
    this.search_value = unique_id
    this.apply(this.search_value)
  }

  onChangeOrderBy(user): void {
    this.isFilterApply = true;
    this.itemOrder = user;
    this.filterData['search_item'] = this.itemOrder.value;
  }

  showUserModal(event, id): void {
    if (!event || event.target.tagName.toLowerCase() !== 'button') {
      this.UserListModal.show(id, this.filterData.type, this.status);
    }
  }

  // User Data List get after filtering
  getUserList(filterData) {
    this._commonService.getAdminTypeList(this.filterData).then((res_data: any) => {
      this.userList = res_data.type_list;
      this.count = res_data.total_page;
      this.cdr.detectChanges();
      setTimeout(() => {
        if (this.userList.length == 0 && this.filterData['page_no'] != 1) {
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

  //Pagination
  pageChanged(event) {
    this.currentPage = event;
    this.filterData['page_no'] = event;
    this.getUserList(this.filterData);
  }

  // Items Per page Filter
  onChangeItemsPerPage(item): void {
    this.itemsPerPage = item;
    this.filterData['item_per_page'] = item;
    if (this.count >= this.currentPage) {
      this.currentPage = 1;
      this.filterData['page_no'] = 1;
    }
    this.getUserList(this.filterData);
  }

  // View Change Gride View and List View
  onViewChange(type) {
    this.viewType = type
  }

  approveDecline(user, status) {
    this.selectedUser = user;
    this.user_id = user._id;
    this.approvalStatus = status;
    this.approveModelRef = this.modalService.show(this.approveTemplate, this.approveModalConfig);
  }

  approve() {
    let json = {
      is_approved: this.approvalStatus.toString(),
      id: this.user_id,
      type: this.filterData.type
    }
    this.userService.userApprove(json).then((res_data) => {
      this.userObservable = this.userService._userObservable.subscribe(() => {
        this.getUserList(this.filterData);
        this.approveModelRef.hide();
      })
    })
  }

  cancel() {
    this.approveModelRef.hide();
  }

  // Approve and Unapprove user list filter
  changeUserType(status) {
    this.currentPage = 1;
    this.filterData['page_no'] = 1;
    this.status = status == user_page_type.approved ? 1 : 0;
    this.filterData['is_approved'] = this.status;
    this.getUserList(this.filterData);
  }

  onChangeType(item): void {
    this.OptionUserType = item;
    this.filterData['user_type'] = this.OptionUserType.value;
    this.isFilterApply = true;
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
      this.getUserList(this.filterData);
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
    this.filterData['user_type'] = this.userType;
    this.OptionUserType = { label: 'label-title.all', value: 'all' };
    this.filterData['start_date'] = null;
    this.filterData['end_date'] = null;
    this.itemOrder = { label: 'label-title.id', value: 'unique_id' };
    this.isFilterApply = false;
    this.item_bsRangeValue = '';
    this.start_date = '';
    this.end_date = '';
    this.getUserList(this.filterData);
  }

  export() {
    if (this.userList.length != 0) {

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
      this._commonService.getAdminTypeList(this.filterData).then((res: any) => {
        this._helper.downloadFile(res.url);
        this.filterData['is_excel_sheet'] = null;
        this.header = '';
      });
    }
    else {
      this._notifierService.showNotification('error', this._helper.trans.instant('label-title.no-record-found'));
    }
  }

  ngOnDestroy() {
    this._helper.selected_id = ''
    if (this.userObservable) {
      this.userObservable.unsubscribe();
    }
    this.notificationObservable.unsubscribe();
    this.search_value = '';
    this.filterData['search_value'] = '';
    this._helper.notification.next(null);
  }
}
