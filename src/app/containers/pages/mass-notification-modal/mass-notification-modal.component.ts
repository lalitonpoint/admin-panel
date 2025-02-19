import { Component, Input, OnInit, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CountryService } from 'src/app/services/country.service';
import { MassNotificationService } from 'src/app/services/mass-notification.service';

@Component({
  selector: 'app-mass-notification-modal',
  templateUrl: './mass-notification-modal.component.html',
  styleUrls: ['./mass-notification-modal.component.scss']
})
export class MassNotificationModalComponent implements OnInit {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  massNotificationForm: UntypedFormGroup;
  all_countries: [] = [];

  @Input() user = true;
  @Output() mass_notofication_data = new EventEmitter<any>();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, private _massNotificationService: MassNotificationService, private _countryService: CountryService) { }

  ngOnInit(): void {
    this._initForm();

    //get country list
    this._countryService.fetchCountry().then(res => {
      this.all_countries = res.country_list;
    })
  }

  //open modal
  show(): void {
    this.massNotificationForm.reset();
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  //intialize form
  _initForm() {
    this.massNotificationForm = new UntypedFormGroup({
      user_type: new UntypedFormControl(null, Validators.required),
      device_type: new UntypedFormControl(null, Validators.required),
      country: new UntypedFormControl(null, Validators.required),
      message: new UntypedFormControl(null, Validators.required),
    })
  }

  //send notification
  sendNotification() {
    this.massNotificationForm.patchValue({
      message: this.massNotificationForm.value.message?.toString().trim(),
    })
    if(this.massNotificationForm.value.user_type == 1 && this.massNotificationForm.value.country == "all"){
      this.massNotificationForm.removeControl('currencycode');
    }
    if(this.massNotificationForm.invalid){
      this.massNotificationForm.markAllAsTouched();
    }
    if(this.massNotificationForm.valid){
      this._massNotificationService.sendNotification(this.massNotificationForm.value).then(res => {
        if (res.success) {
          this.mass_notofication_data.emit();
          this.closeModal();
        }
      })
    }
  }

  closeModal(){
    this.modalRef.hide();
    setTimeout(() => {
      this.massNotificationForm.removeControl('currencycode');
      this.massNotificationForm.reset();
    }, 200);
  }

  onChangeUserType() {
    if(this.massNotificationForm.value.user_type == 1){
      this.massNotificationForm.addControl('currencycode',new UntypedFormControl(null, Validators.required));
    }else{
      this.massNotificationForm.removeControl('currencycode');
    }
  }

  onChangeCountry(country_id){
    if (this.massNotificationForm.value.user_type == 1 && country_id.toString().toLowerCase() != 'all') {
      let country:any = this.all_countries.find((x:any) => x._id == country_id);
      if(country){
        this.massNotificationForm.patchValue({
          currencycode : country.currencycode
        })
      }
    }
  }

}
