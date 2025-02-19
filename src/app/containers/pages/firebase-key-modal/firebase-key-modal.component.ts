import { Component, OnInit, TemplateRef, ViewChild,Output,EventEmitter } from '@angular/core';
import { UntypedFormGroup,UntypedFormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-firebase-key-modal',
  templateUrl: './firebase-key-modal.component.html',
  styleUrls: ['./firebase-key-modal.component.scss']
})
export class FirebaseKeyModalComponent implements OnInit {
  firebaseGCMForm:UntypedFormGroup;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };

  @Output() firebase_GCM_data = new EventEmitter<any>();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService,private _settingService:SettingsService) { }

  ngOnInit(): void {
    this._initForm();
  }

  //initialize form
  _initForm(){
    this.firebaseGCMForm = new UntypedFormGroup({
      setting_id:new UntypedFormControl(null),
      firebase_apiKey:new UntypedFormControl(null),
      firebase_authDomain:new UntypedFormControl(null),
      firebase_databaseURL:new UntypedFormControl(null),
      firebase_projectId:new UntypedFormControl(null),
      firebase_storageBucket:new UntypedFormControl(null),
      firebase_messagingSenderId:new UntypedFormControl(null),
      android_user_app_gcm_key:new UntypedFormControl(null),
      android_provider_app_gcm_key:new UntypedFormControl(null),
    })
  }

  //get data from parent and open modal
  show(setting_detail): void {
    this.firebaseGCMForm.patchValue(setting_detail);
    this.firebaseGCMForm.patchValue({
      setting_id:setting_detail._id
    });
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  //update
  update(){
    Object.keys(this.firebaseGCMForm.controls).forEach((key) => this.firebaseGCMForm.get(key).setValue(this.firebaseGCMForm.get(key).value.trim()));
    this._settingService.updateSettingDetails(this.firebaseGCMForm.value).then(res => {
      if(res.success){
        this.firebase_GCM_data.emit();
        this.closeModal();
      }
    })
  }

  closeModal(){
    this.modalRef.hide();
    setTimeout(() => {
      this.firebaseGCMForm.reset();
    }, 1000);
  }

}
