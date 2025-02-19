import { Component, OnInit, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SettingsService } from 'src/app/services/settings.service';
import { Helper } from 'src/app/shared/helper';
import { DOMAIN } from 'src/app/constants/constants'

@Component({
  selector: 'app-email-configuration-modal',
  templateUrl: './email-configuration-modal.component.html',
  styleUrls: ['./email-configuration-modal.component.scss']
})
export class EmailConfigurationModalComponent implements OnInit {
  emailConfigurationForm: UntypedFormGroup;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };

  @Output() email_data = new EventEmitter<any>();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, public _helper: Helper, private _settingService: SettingsService) { }

  ngOnInit(): void {
    this._initForm();
  }

  //intialize form
  _initForm() {
    this.emailConfigurationForm = new UntypedFormGroup({
      setting_id: new UntypedFormControl(null),
      domain: new UntypedFormControl(null),
      email: new UntypedFormControl(null),
      password: new UntypedFormControl(null),
      smtp_host: new UntypedFormControl(null),
      smtp_port: new UntypedFormControl(null),
    })
  }

  //get data from parent and open modal
  show(setting_detail): void {
    this.emailConfigurationForm.patchValue(setting_detail)
    this.emailConfigurationForm.patchValue({
      setting_id: setting_detail._id
    });
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  //update data
  update() {
    if(this.emailConfigurationForm.value.domain == 1){
      this.emailConfigurationForm.patchValue({
        domain:DOMAIN[1]
      })
    }else if(this.emailConfigurationForm.value.domain == 2){
      this.emailConfigurationForm.patchValue({
        domain:DOMAIN[2]
      })
    }
    Object.keys(this.emailConfigurationForm.controls).forEach((key) => {
      if (key != 'domain' && key != 'smtp_port') {
        this.emailConfigurationForm.get(key).setValue(this.emailConfigurationForm.get(key).value.trim())
      }
    });
    this._settingService.updateSettingDetails(this.emailConfigurationForm.value).then(res => {
      if (res.success) {
        this.email_data.emit();
        this.closeModal();
      }
    })
  }

  closeModal() {
    this.modalRef.hide();
    setTimeout(() => {
      this.emailConfigurationForm.reset();
    }, 1000);
  }

}
