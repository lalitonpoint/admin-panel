import { Component, ViewChild,Input,Output,EventEmitter } from '@angular/core';
import { BaseUrlModalComponent } from '../base-url-modal/base-url-modal.component';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-base-url',
  templateUrl: './base-url.component.html',
  styleUrls: ['./base-url.component.scss']
})
export class BaseUrlComponent {

  @Input() setting_detail:any;
  @Output() url_data = new EventEmitter<any>();
  @ViewChild('baseUrlModalComponent', { static: true }) baseUrlModalComponent: BaseUrlModalComponent;

  constructor(public _helper:Helper) { }

  //open modal
  showBaseUrlModal() {
    this.baseUrlModalComponent.show(this.setting_detail);
  }

  //emit data
  getSettingData(){
    this.url_data.emit();
  }

}
