import { Helper } from '../../../shared/helper';
import { CommonService } from 'src/app/services/common.service';
import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/services/sockert.service';

@Component({
  selector: 'app-export-history-model',
  templateUrl: './export-history-model.component.html',
  styleUrls: ['./export-history-model.component.scss']
})
export class ExportHistoryModelComponent implements OnInit {
  modalRef: BsModalRef;
  confirmModelRef: BsModalRef;
  user_id: any;
  type: any;
  requestList : any ;
  listData : any ;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  confirmationModalConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
  }
  timezone_for_display_date:string = '';
  exportHistoryObservable: Subscription;
  id:any;
  isModalOpen: boolean = false;

  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  @ViewChild('confirmationTemplate', { static: true }) confirmationTemplate: TemplateRef<any>;
  
  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.code === 'Escape') {
      this.modalRef?.onHidden.subscribe(() => {
        this.onClose();
      })
    }
  }

  constructor(private modalService: BsModalService , private _fb : FormBuilder , private commonService : CommonService , public _helper : Helper,private _socket:SocketService ) {  }

  ngOnInit(): void {
    this._helper.display_date_timezone.subscribe(data => {
      this.timezone_for_display_date = data;
    })
  }
  
  show(type,export_user_id): void {
    this.getExportHistory(type,export_user_id);
    this.socket(type,export_user_id);
    let json: any = { type: type, export_user_id: export_user_id }
    this.exportHistoryObservable = this.commonService.__exportChangesObservable.subscribe((data) => {
      this.commonService.getExportHistoryList(json).then((res_data: any) => {
        this.listData = res_data.export_history_data;
        this.listData?.reverse();
      })
    })
    if(!this.isModalOpen){
      this.modalRef = this.modalService.show(this.template, this.config);
      this.isModalOpen = true;
    }
  }

  getExportHistory(type,export_user_id){
    let json: any = { type: type, export_user_id: export_user_id }
    this.commonService.getExportHistoryList(json).then((res_data: any) => {
      this.listData = res_data.export_history_data;
      this.listData?.reverse();
    })
  }

  onDelete(id){
    this.id = id;
    this.confirmModelRef = this.modalService.show(this.confirmationTemplate, this.confirmationModalConfig);
    this.onClose();
  }

  cancel(){
    this.confirmModelRef.hide()
  }

  confirm(){
    this.commonService.deleteExportFile({id: this.id}).then((res_data : any )=>{
      if(res_data.success){
        this.cancel();
      }
    })
  }

  onClose(){
    this.modalRef.hide();
    this.isModalOpen = false;
  }

  socket(type, export_user_id) {
    this._socket.listener("export_history_socket").subscribe((response: any) => {
      if (response && response.type == type) {
        this.getExportHistory(type, export_user_id);
      }
    })
  }

}
