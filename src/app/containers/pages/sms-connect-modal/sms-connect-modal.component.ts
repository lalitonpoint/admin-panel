import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-sms-connect-modal',
  templateUrl: './sms-connect-modal.component.html',
  styleUrls: ['./sms-connect-modal.component.scss']
})
export class SmsConnectModalComponent implements OnInit {
  modalRef: BsModalRef;
  commonForm: UntypedFormGroup;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService) { }

  ngOnInit(): void {
    this._initForm();
  }

  _initForm() {
    this.commonForm = new UntypedFormGroup({
      sms_auth_id: new UntypedFormControl(null, [Validators.required]),
      sms_auth_token: new UntypedFormControl(null, [Validators.required]),
      sms_number: new UntypedFormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(10)]),
    });
  }

  show(): void {
    this.modalRef = this.modalService.show(this.template, this.config);
  }
}
