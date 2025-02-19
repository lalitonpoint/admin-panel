import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PanelNameModalComponent } from 'src/app/containers/pages/panel-name-modal/panel-name-modal.component';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-panel-name',
  templateUrl: './panel-name.component.html',
  styleUrls: ['./panel-name.component.scss']
})
export class PanelNameComponent{

  @Input() setting_detail:any;
  @Output() panel_name = new EventEmitter<any>();
  @ViewChild('panelNameModal', { static: true }) panelNameModal: PanelNameModalComponent;

  constructor(public _helper:Helper) { }

  //open modal
  showPanelNameModal(){
    this.panelNameModal.show(this.setting_detail);
  }

  //emit data
  getSettingData(){
    this.panel_name.emit();
  }

}
