import { Component, ViewChild,Input,Output,EventEmitter } from '@angular/core';
import { FirebaseKeyModalComponent } from 'src/app/containers/pages/firebase-key-modal/firebase-key-modal.component';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-admin-firebase-gcm-key-settings',
  templateUrl: './admin-firebase-gcm-key-settings.component.html',
  styleUrls: ['./admin-firebase-gcm-key-settings.component.scss']
})
export class AdminFirebaseGCMKeySettingsComponent {
  
  @Input() setting_detail:any;
  @Output() firebase_GCM_data = new EventEmitter<any>();
  @ViewChild('firebaseKeyModal', { static: true }) firebaseKeyModal: FirebaseKeyModalComponent;

  constructor(public _helper:Helper) { }

  //open modal
  showFirebaseKeyModal(): void{
    this.firebaseKeyModal.show(this.setting_detail);
  }

  //emit data
  getSettingData(){
    this.firebase_GCM_data.emit();
  }

}
