import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-wsal-response-modal',
  templateUrl: './wsal-response-modal.component.html',
  styleUrls: ['./wsal-response-modal.component.scss']
})
export class WsalResponseModalComponent implements OnInit {

  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  response_data: any
  request_data: any

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService) { }

  ngOnInit(): void {
  }

  show(data){
    this.response_data = JSON.stringify(data.wsal_response, null, 2);
    this.request_data = JSON.stringify(data.wsal_request, null, 2);
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  onClose() {
    this.modalRef.hide();
    this.response_data = null;
    this.request_data = null;
  }
}
