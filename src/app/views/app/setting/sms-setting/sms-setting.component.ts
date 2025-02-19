import { Component, OnInit, ViewChild } from '@angular/core';
import { SmsConnectModalComponent } from 'src/app/containers/pages/sms-connect-modal/sms-connect-modal.component';
import { TemplateService } from 'src/app/services/template.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-sms-setting',
  templateUrl: './sms-setting.component.html',
  styleUrls: ['./sms-setting.component.scss']
})
export class SmsSettingComponent implements OnInit {
  selected_sms = {
    smsContent: "",
    smsUniqueId: "",
    smsUniqueTitle: "",
    isSendSMS : true,
    isSendWhatsapp : true,
    _id: null
  }
  sms_details:any=[];
  selecetedSms : any;
  selecetedSmsTitle : any;
  subadmin_readonly:boolean = false;
  isSendSMS:boolean = true;
  isSendWhatsapp:boolean = true;

  @ViewChild('smsConnectModal', { static: true }) smsConnectModal: SmsConnectModalComponent;

  constructor(private _templateService:TemplateService,public _helper:Helper) { }

  ngOnInit(): void {
    //get sms title list
    let json:any = {}
    this._templateService.getSmsDetails(json).then(res => {
      if (res.success) {
        this.sms_details = res.sms_details;
        this.selecetedSms = this.sms_details[0];
        this.selecetedSmsTitle = this.sms_details[0].smsUniqueTitle;
        this.isSendSMS = this.sms_details[0].isSendSMS;
        this.isSendWhatsapp = this.sms_details[0].isSendWhatsapp;
        this.onSelectSms(this.selecetedSms);
      }
    })
    if(!this._helper.has_permission(this._helper.PERMISSION.EDIT)){
      this.subadmin_readonly = true; 
    }
  }

  //patch data when select sms from select menu
  onSelectSms(event){
    if(event){
      this.selected_sms = event;
    }else{
      this.selected_sms = {
        smsContent: "",
        smsUniqueId: "",
        smsUniqueTitle: "",
        isSendSMS : true,
        isSendWhatsapp : true,
        _id: null
      }
    }
  }

  //update data
  save(){
    if(this.selected_sms._id){
      let json: any = {
        sms_id: this.selected_sms._id,
        smsUniqueTitle: this.selected_sms.smsUniqueTitle,
        smsContent: this.selected_sms.smsContent,
        isSendSMS: this.selected_sms.isSendSMS,
        isSendWhatsapp: this.selected_sms.isSendWhatsapp,
      }
      this._templateService.updateSmsDetails(json)
    }
  }

  //open connnect modal
  // showSmsConnectModal(): void{
  //   this.smsConnectModal.show();
  // }
}
