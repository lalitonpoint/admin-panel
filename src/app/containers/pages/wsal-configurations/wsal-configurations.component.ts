import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Helper } from 'src/app/shared/helper';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-wsal-configurations',
  templateUrl: './wsal-configurations.component.html',
  styleUrls: ['./wsal-configurations.component.scss']
})
export class WsalConfigurationsComponent implements OnInit {
  wsalConfigurationForm: UntypedFormGroup;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };

  @Input() setting_detail: any;
  @Output() WSAL_data = new EventEmitter<any>();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(public _helper: Helper, private modalService: BsModalService, private _settingService: SettingsService) { }

  ngOnInit(): void {
    this._initForm()
  }

  //open modal
  showWsalConfigurationModal() {
    this.wsalConfigurationForm.patchValue(this.setting_detail);
    this.wsalConfigurationForm.patchValue({
      setting_id: this.setting_detail._id
    });
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  //initialize form
  _initForm() {
    this.wsalConfigurationForm = new UntypedFormGroup({
      setting_id:new UntypedFormControl(null),
      is_wsal_service_use: new UntypedFormControl(false),
      wsal_client_id: new UntypedFormControl(null),
      wsal_app_id: new UntypedFormControl(null),
      wsal_app_key: new UntypedFormControl(null)
    })
  }

  //get data from parent and open modal
  show(setting_detail): void {
    this.wsalConfigurationForm.patchValue(setting_detail);
    this.wsalConfigurationForm.patchValue({
      setting_id: setting_detail._id
    });
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  //update
  update() {
    this._settingService.updateSettingDetails(this.wsalConfigurationForm.value).then(res => {
      if (res.success) {
        this.closeModal();
        this.WSAL_data.emit();
      }
    })
  }

  closeModal() {
    this.modalRef.hide()
    setTimeout(() => {
      this.wsalConfigurationForm.reset();
    }, 1000);
  }

}
