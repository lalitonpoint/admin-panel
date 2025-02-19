import { Component, OnInit, TemplateRef } from '@angular/core';
import { SettingsService } from 'src/app/services/settings.service';
import { Helper } from 'src/app/shared/helper';
import { UPDATE_LOG_STRING, LOG_TYPE_STRING, UPDATE_LOG_TYPE, LOG_TYPE_VALUE, } from 'src/app/constants/constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SubAdminService } from 'src/app/services/sub-admin.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
})
export class LogsComponent implements OnInit {
  darkTheme = localStorage.getItem('vien-themecolor');
  logs_list: Array<any>;
  current_page: number = 1;
  itemOptionsPerPage: Array<number>;
  itemsPerPage: number = 20;
  total_page: number = 0;
  timezone_for_display_date: string = '';
  UPDATE_LOG_TYPE = UPDATE_LOG_TYPE;
  UPDATE_LOG_STRING = UPDATE_LOG_STRING;
  LOG_TYPE_STRING = LOG_TYPE_STRING;
  todayDate: Date = new Date();
  LOG_TYPE_VALUE = LOG_TYPE_VALUE;
  logChange: BsModalRef;
  selected_log: any;
  darkMode: boolean = false;
  direction = localStorage.getItem('direction');
  admin_list: any;
  admin_name: any;
  log_type: any;
  info_detail: any;
  filter_date_range: any;
  is_clear_disabled: boolean = true;
  created_date: Date;
  UPDATE_LOG_TYPE_ARRAY: any[] = [];
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-lg modal-dialog-centered',
  };
  start_date: any;
  end_date: any;

  constructor(private _settingsService: SettingsService,public _helper: Helper,private modalService: BsModalService,private subadminService: SubAdminService) {}

  ngOnInit(): void {
    if (this.darkTheme.startsWith('dark')) {
      this.darkMode = true;
    }

    //convert UPDATE_LOG_TYPE object values to array
    this.UPDATE_LOG_TYPE_ARRAY = Object.values(UPDATE_LOG_TYPE);

    this._helper.display_date_timezone.subscribe((data) => {
      this.timezone_for_display_date = data;
    });

    this._helper.created_date.subscribe((data) => {
      if (data) {
        let date = new Date(data);
        this.created_date = date;
      }
    });

    this.logsList();
    this.getAdminList();
    this.itemOptionsPerPage = this._helper.PER_PAGE_LIST;
  }

  // get logs list
  logsList(): void {
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
    let json = {
      page: this.current_page,
      limit: this.itemsPerPage,
      user_id: this.admin_name == "all" ? null : this.admin_name,
      setting_type: this.log_type == "all" ? null : this.log_type,
      log_type: this.info_detail == "all" ? null : this.info_detail,
      start_date: start_date,
      end_date: end_date,
    };
    this._settingsService.getChangeLogs(json).then((response: any) => {
      if (response.success) {
        this.logs_list = response.logs;
        this.total_page = response.total_page;
      }
    });
  }

  //get all admin list 
  getAdminList() {
    this.subadminService.adminList().then((res_data) => {
      this.admin_list = res_data.admin_list;
    });
  }

  //when change pagination page
  pageChanged(event: number): void {
    this.current_page = event;
    this.logsList();
  }

  //when change page limit
  onChangeItemsPerPage(item: number): void {
    if (this.total_page >= this.current_page) {
      this.current_page = 1;
    }
    this.itemsPerPage = item;
    this.filter_date_range = null;
    this.start_date = null;
    this.end_date = null;
    this.admin_name = null;
    this.log_type = null;
    this.info_detail = null;
    this.is_clear_disabled = true;
    this.logsList();
  }

  logChangesModal(modal: TemplateRef<any>, log: any): void {
    this.logChange = this.modalService.show(modal, this.config);
    this.selected_log = log;
  }

  closelogChangesModal(): void {
    this.logChange.hide();
    setTimeout(() => {
      this.selected_log = '';
    }, 500);
  }

  apply() {
    if (this.filter_date_range?.length) {
      this.is_clear_disabled = false;
      this.start_date = this.filter_date_range[0];
      this.end_date = this.filter_date_range[1];
    }
    if (this.total_page >= this.current_page) {
      this.current_page = 1;
    }
    this.logsList();
  }

  clear() {
    this.filter_date_range = null;
    this.start_date = null;
    this.end_date = null;
    this.admin_name = null;
    this.log_type = null;
    this.info_detail = null;
    this.is_clear_disabled = true;
    if (this.total_page >= this.current_page) {
      this.current_page = 1;
    }
    this.logsList();
  }
}
