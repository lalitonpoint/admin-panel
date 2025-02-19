import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SettingsService } from 'src/app/services/settings.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-rental-payment-configuration',
  templateUrl: './rental-payment-configuration.component.html',
  styleUrls: ['./rental-payment-configuration.component.scss']
})
export class RentalPaymentConfigurationComponent implements OnInit {

  rentalPaymentConfigurationForm: UntypedFormGroup;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  admin_detail:any

  @Input() setting_detail: any;
  @Output() rental_payment_data = new EventEmitter<any>();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(public _helper: Helper, private modalService: BsModalService, private _settingService: SettingsService) { 
    this.admin_detail = _helper.user_details;
  }

  ngOnInit(): void {
    this._initForm()
  }

  //open modal
  showRentalPaymentConfigurationModal() {
    this.rentalPaymentConfigurationForm.patchValue(this.setting_detail);
    this.rentalPaymentConfigurationForm.patchValue({
      setting_id: this.setting_detail._id
    });
    if (this.setting_detail.is_rental) {
      this.rentalPaymentConfigurationForm.get('is_rental')?.disable();
    } else {
      this.rentalPaymentConfigurationForm.get('is_rental')?.enable();
    }
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  //initialize form
  _initForm() {
    this.rentalPaymentConfigurationForm = new UntypedFormGroup({
      setting_id:new UntypedFormControl(null),
      is_rental: new UntypedFormControl(false, Validators.required),
      rental_subscription_type: new UntypedFormControl(0),
      sub_price_id: new UntypedFormControl(null),
      rental_title: new UntypedFormControl(null),
      rental_amount: new UntypedFormControl(null),
      rental_description: new UntypedFormControl(null),
      rental_processing_fee: new UntypedFormControl(null),
      rental_amount_currency: new UntypedFormControl(null),
      rental_subscription_frequency: new UntypedFormControl(null)
    })
  }

  //get data from parent and open modal
  show(setting_detail): void {
    this.rentalPaymentConfigurationForm.patchValue(setting_detail);
    this.rentalPaymentConfigurationForm.patchValue({
      setting_id: setting_detail._id
    });
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  //update
  update() {
    this._settingService.updateSettingDetails(this.rentalPaymentConfigurationForm.value).then(res => {
      if (res.success) {
        this.closeModal();
        this.rental_payment_data.emit();
      }
    })
  }

  closeModal() {
    this.modalRef.hide()
    setTimeout(() => {
      this.rentalPaymentConfigurationForm.reset();
    }, 1000);
  }

}
