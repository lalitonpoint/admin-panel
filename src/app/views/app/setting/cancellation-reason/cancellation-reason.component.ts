import { Subscription } from 'rxjs';
import { PANEL_TYPE } from './../../../../constants/constants';
import { Component, EventEmitter, Input, OnInit, TemplateRef, ViewChild, } from '@angular/core';
import { AddNewCancellationReasonComponent } from 'src/app/containers/pages/add-new-cancellation-reason/add-new-cancellation-reason.component';
import { CancellationReasonService } from 'src/app/services/cancellationreason.service';
import { Helper } from 'src/app/shared/helper';
import { LangService } from 'src/app/shared/lang.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-cancellation-reason',
  templateUrl: './cancellation-reason.component.html',
  styleUrls: ['./cancellation-reason.component.scss'],
})
export class CancellationReasonComponent implements OnInit {
  darkTheme = localStorage.getItem('vien-themecolor');
  confirmModelRef: BsModalRef;
  confirmationModalConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  itemOrder = { label: 'label-title.id', value: 'unique_id' };
  itemOptionsOrders = [
    { label: 'label-title.id', value: 'unique_id', isShow: true },
    { label: 'label-title.name', value: 'first_name', isShow: true },
    { label: 'label-title.email', value: 'email', isShow: true },
    { label: 'label-title.phone', value: 'phone', isShow: true },
  ];
  search_value: string = '';
  referralList: any;
  currentPage: number = 1;
  count: number;
  isExelSheet: boolean = false;
  darkMode: boolean = false;
  is_clear_disabled: boolean = true;
  PANEL_TYPE = PANEL_TYPE;
  user_type = PANEL_TYPE.USER;
  cancellation_reasons = [];
  selected_reason : any;
  advertise_subscriper: Subscription;

  changeOrderBy: EventEmitter<any> = new EventEmitter();
  @Input() showItemsPerPage = true;
  @Input() itemsPerPage = 20;
  @Input() itemOptionsPerPage = [];
  @ViewChild('addNewModalRef', { static: true }) addNewModalRef: AddNewCancellationReasonComponent;
  @ViewChild('confirmationTemplate', { static: true }) confirmationTemplate: TemplateRef<any>;

  constructor(public _helper: Helper,private _cancellationReasonService: CancellationReasonService,public _lang: LangService,private modalService : BsModalService) {}

  ngOnInit(): void {
    this.advertise_subscriper =
      this._cancellationReasonService._addvertiseObservable.subscribe(() => {
        this.getCancellationReasons();
      });
  }

  addAdvertiseModal(): void {
    this.addNewModalRef.show(null, this.user_type);
  }

  getCancellationReasons() {
    this._cancellationReasonService
      .list({ user_type: Number(this.user_type) })
      .then((res) => {
        if (res.success) {
          this.cancellation_reasons = res.list;
        } else {
          this.cancellation_reasons = [];
        }
      });
  }

  editAdvertiseModal(reason) {
    this.addNewModalRef.show(reason, this.user_type);
  }

  changeUserType(user_type){
    this.user_type = user_type
    this.getCancellationReasons();
  }

  onDelete(reason) {
    this.selected_reason = reason;
    this.confirmModelRef = this.modalService.show(
      this.confirmationTemplate,
      this.confirmationModalConfig
    );
  }

  confirm(){
    if(this.selected_reason._id){
      this._cancellationReasonService.deleteCancellationReason({reason_id : this.selected_reason._id}).then((res) => {
        this.confirmModelRef.hide();
      })
    }
  }

  ngOnDestroy(): void {
    this.advertise_subscriper.unsubscribe()
    if(this.addNewModalRef.modalRef) {
      this.addNewModalRef.close();
    }
  }
}
