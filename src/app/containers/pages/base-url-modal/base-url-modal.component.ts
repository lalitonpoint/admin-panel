import { Component, OnInit, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SettingsService } from 'src/app/services/settings.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-base-url-modal',
  templateUrl: './base-url-modal.component.html',
  styleUrls: ['./base-url-modal.component.scss']
})
export class BaseUrlModalComponent implements OnInit {
  baseUrlForm: UntypedFormGroup;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  payment_base_url_last:any;
  payment_base_url_first:any;
  mass_notification_base_url_last:any;
  mass_notification_base_url_first:any;
  whatsapp_base_url_last:any;
  whatsapp_base_url_first:any;

  @Output() url_data = new EventEmitter<any>();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, public _helper: Helper, private _settingService: SettingsService) { }

  ngOnInit(): void {
    this._initForm();
  }

  //initialize form
  _initForm() {
    this.baseUrlForm = new UntypedFormGroup({
      setting_id: new UntypedFormControl(null),
      payments_base_url: new UntypedFormControl(null),
      history_base_url: new UntypedFormControl(null),
      mass_notification_base_url: new UntypedFormControl(null),
      whatsapp_base_url: new UntypedFormControl(null),
    })
  }

  //get data from parent and open modal
  show(setting_detail): void {
    if(setting_detail){
      if(setting_detail.payments_base_url){
        this.payment_base_url_last = setting_detail.payments_base_url.split('/').pop();
        if(setting_detail.payments_base_url.includes('/' + this.payment_base_url_last)){
          let str = setting_detail.payments_base_url;
          let lastIndex = str.lastIndexOf("/");
          str = str.substring(0, lastIndex);
          this.payment_base_url_first = str;
          this.baseUrlForm.patchValue({
            payments_base_url : this.payment_base_url_first
          });
        }
      }else{
        this.payment_base_url_last = 'payments'
      }

      if(setting_detail.history_base_url){
        this.baseUrlForm.patchValue({
          history_base_url : setting_detail.history_base_url
        });
      }

      if(setting_detail.mass_notification_base_url){
        this.mass_notification_base_url_last = setting_detail.mass_notification_base_url.split('/').pop();
        if(setting_detail.mass_notification_base_url.includes('/' + this.mass_notification_base_url_last)){
          let str = setting_detail.mass_notification_base_url;
          let lastIndex = str.lastIndexOf("/");
          str = str.substring(0, lastIndex);
          this.mass_notification_base_url_first = str;
          this.baseUrlForm.patchValue({
            mass_notification_base_url : this.mass_notification_base_url_first
          });
        }
      }else{
        this.mass_notification_base_url_last = 'mass_notifications';
      }

      if(setting_detail.whatsapp_base_url){
        this.whatsapp_base_url_last = setting_detail.whatsapp_base_url.split('/').pop();
        if(setting_detail.whatsapp_base_url.includes('/' + this.whatsapp_base_url_last)){
          let str = setting_detail.whatsapp_base_url;
          let lastIndex = str.lastIndexOf("/");
          str = str.substring(0, lastIndex);
          this.whatsapp_base_url_first = str;
          this.baseUrlForm.patchValue({
            whatsapp_base_url : this.whatsapp_base_url_first
          });
        }
      }else{
        this.whatsapp_base_url_last = 'whatsapp';
      }

      this.baseUrlForm.patchValue({
        setting_id: setting_detail._id
      });
      this.modalRef = this.modalService.show(this.template, this.config);
    }
  }

  //update
  update() {
    let json : any = {setting_id:this.baseUrlForm.value.setting_id,payments_base_url:null,history_base_url:this.baseUrlForm.value.history_base_url}
    if(this.baseUrlForm.value.payments_base_url[this.baseUrlForm.value.payments_base_url?.length-1] === "/"){
      let str = this.baseUrlForm.value.payments_base_url;
      str = str.substring(0, str.length - 1);
      json['payments_base_url'] = str + '/' + this.payment_base_url_last;
    }else{
      json['payments_base_url'] = this.baseUrlForm.value.payments_base_url + '/' + this.payment_base_url_last ;
    }
    if(this.baseUrlForm.value.mass_notification_base_url[this.baseUrlForm.value.mass_notification_base_url?.length-1] === "/"){
      let str = this.baseUrlForm.value.mass_notification_base_url;
      str = str.substring(0, str.length - 1);
      json['mass_notification_base_url'] = str + '/' + this.mass_notification_base_url_last;
    }else{
      json['mass_notification_base_url'] = this.baseUrlForm.value.mass_notification_base_url + '/' + this.mass_notification_base_url_last ;
    }
    if(this.baseUrlForm.value.whatsapp_base_url[this.baseUrlForm.value.whatsapp_base_url?.length-1] === "/"){
      let str = this.baseUrlForm.value.whatsapp_base_url;
      str = str.substring(0, str.length - 1);
      json['whatsapp_base_url'] = str + '/' + this.whatsapp_base_url_last;
    }else{
      json['whatsapp_base_url'] = this.baseUrlForm.value.whatsapp_base_url + '/' + this.whatsapp_base_url_last ;
    }
    this._settingService.updateSettingDetails(json).then(res => {
      if (res.success) {
        this.url_data.emit();
        this.closeModal();
      }
    })
  }

  closeModal() {
    this.modalRef.hide();
    setTimeout(() => {
      this.baseUrlForm.reset();
    }, 1000);
  }

}
