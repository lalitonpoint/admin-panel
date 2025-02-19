import { Component, OnInit, TemplateRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SettingsService } from 'src/app/services/settings.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-payment-configuration-modal',
  templateUrl: './payment-configuration-modal.component.html',
  styleUrls: ['./payment-configuration-modal.component.scss']
})
export class PaymentConfigurationModalComponent implements OnInit {
  paymentlConfigurationForm: UntypedFormGroup;
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };

  @Output() payment_data = new EventEmitter<any>();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService, public _helper: Helper, private _settingService: SettingsService) { }

  ngOnInit(): void {
    this._initForm();
  }

  //initialize form
  _initForm() {
    this.paymentlConfigurationForm = new UntypedFormGroup({
      setting_id: new UntypedFormControl(null),
      payment_gateway_type: new UntypedFormControl(null),
      stripe_secret_key: new UntypedFormControl(null),
      stripe_publishable_key: new UntypedFormControl(null),
      paystack_secret_key: new UntypedFormControl(null),
      paystack_publishable_key: new UntypedFormControl(null),
      payu_key: new UntypedFormControl(null),
      payu_salt: new UntypedFormControl(null),
      paytabs_server_key: new UntypedFormControl(null),
      paytabs_client_key: new UntypedFormControl(null),
      paytabs_profileId: new UntypedFormControl(null),
      paypal_client_id: new UntypedFormControl(null),
      paypal_secret_key: new UntypedFormControl(null),
      razorpay_client_id: new UntypedFormControl(null),
      razorpay_secret_key: new UntypedFormControl(null),
    })
  }

  //get data from parent and open modal
  show(setting_detail): void {
    this.paymentlConfigurationForm.patchValue(setting_detail);
    this.paymentlConfigurationForm.patchValue({
      setting_id: setting_detail._id
    });
    this.modalRef = this.modalService.show(this.template, this.config);
  }

  //update
  update() {
    Object.keys(this.paymentlConfigurationForm.controls).forEach(
      (key) =>{
        if(key != 'payment_gateway_type'){
          this.paymentlConfigurationForm.get(key).setValue(this.paymentlConfigurationForm.get(key).value.trim())
        }
      }
    );
    this._settingService.updateSettingDetails(this.paymentlConfigurationForm.value).then(res => {
      if (res.success) {
        this.payment_data.emit();
        this.closeModal();
      }
    })
  }

  closeModal() {
    this.modalRef.hide();
    setTimeout(() => {
      this.paymentlConfigurationForm.reset();
    }, 1000);
  }

}
