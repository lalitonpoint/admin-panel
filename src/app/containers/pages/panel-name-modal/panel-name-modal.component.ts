import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SettingsService } from 'src/app/services/settings.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-panel-name-modal',
  templateUrl: './panel-name-modal.component.html',
  styleUrls: ['./panel-name-modal.component.scss']
})
export class PanelNameModalComponent implements OnInit {

  panelNameForm:UntypedFormGroup;
  modalRef:BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  @Output() panel_name = new EventEmitter<any>();

  constructor(private modalService: BsModalService,public _helper:Helper,private _settingService: SettingsService) { }

  ngOnInit(): void {
    this._initForm();
  }

  //initialize form
  _initForm(){
    this.panelNameForm = new UntypedFormGroup ({
      setting_id: new UntypedFormControl(null, Validators.required),
      app_name: new UntypedFormControl(null,Validators.required),
      partner_panel_name: new UntypedFormControl(null,Validators.required),
      dispatcher_panel_name: new UntypedFormControl(null,Validators.required),
      hotel_panel_name: new UntypedFormControl(null,Validators.required),
      corporate_panel_name: new UntypedFormControl(null,Validators.required),
    })
  }

  //get data from parent and open modal
  show(setting_detail): void {
    this.panelNameForm.patchValue(setting_detail);
    this.panelNameForm.patchValue({
      setting_id:setting_detail._id
    });
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  //update
  updatePanel(){
    this._settingService.updateSettingDetails(this.panelNameForm.value).then(res => {
      if(res.success){
        this.closeModal();
        this.panel_name.emit();
      }
    });
  }

  closeModal(){
    this.modalRef.hide();
    setTimeout(() => {
      this.panelNameForm.reset();
    }, 1000);
  }

}
