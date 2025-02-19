import { Component, OnInit, TemplateRef, ViewChild,Output,EventEmitter } from '@angular/core';
import { UntypedFormGroup,UntypedFormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SettingsService } from 'src/app/services/settings.service';
@Component({
  selector: 'app-app-url-setting-modal',
  templateUrl: './app-url-setting-modal.component.html',
  styleUrls: ['./app-url-setting-modal.component.scss']
})
export class AppUrlSettingModalComponent implements OnInit {
  appUrlForm:UntypedFormGroup;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };

  @Output() api_url_data = new EventEmitter<any>();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService,private _settingService:SettingsService) { }

  ngOnInit(): void {
    this._initForm();
  }

  //initialize form
  _initForm(){
    this.appUrlForm = new UntypedFormGroup({
      setting_id:new UntypedFormControl(null),
      android_client_app_url:new UntypedFormControl(null),
      android_driver_app_url:new UntypedFormControl(null),
      ios_client_app_url:new UntypedFormControl(null),
      ios_driver_app_url:new UntypedFormControl(null),
    })
  }

  //get data from parent and open modal
  show(setting_detail): void {
    this.appUrlForm.patchValue(setting_detail);
    this.appUrlForm.patchValue({
      setting_id:setting_detail._id
    });
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  //update data
  update(){
    Object.keys(this.appUrlForm.controls).forEach((key) => this.appUrlForm.get(key).setValue(this.appUrlForm.get(key).value.trim()));
    this._settingService.updateSettingDetails(this.appUrlForm.value).then(res => {
      if(res.success){
        this.api_url_data.emit();
        this.closeModal();
      }
    })
  }

  closeModal(){
    this.modalRef.hide();
    setTimeout(() => {
      this.appUrlForm.reset();
    }, 1000);
  }

}
