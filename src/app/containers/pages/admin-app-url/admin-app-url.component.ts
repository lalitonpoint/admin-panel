import { Component, ViewChild,Input,Output,EventEmitter } from '@angular/core';
import { AppUrlSettingModalComponent } from 'src/app/containers/pages/app-url-setting-modal/app-url-setting-modal.component';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-admin-app-url',
  templateUrl: './admin-app-url.component.html',
  styleUrls: ['./admin-app-url.component.scss']
})
export class AdminAppUrlComponent {
  
  @Input() setting_detail:any;
  @Output() api_url_data = new EventEmitter<any>();
  @ViewChild('appUrlSettingModal', { static: true }) appUrlSettingModal: AppUrlSettingModalComponent;

  constructor(public _helper:Helper) { }

  //open modal
  showAppUrlSettingModal(): void{
    this.appUrlSettingModal.show(this.setting_detail);
  }

  //emit data
  getSettingData(){
    this.api_url_data.emit();
  }

}
