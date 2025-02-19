import { Component, ViewChild,Input,Output,EventEmitter } from '@angular/core';
import { PaymentConfigurationModalComponent } from '../payment-configuration-modal/payment-configuration-modal.component';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-payment-configurations',
  templateUrl: './payment-configurations.component.html',
  styleUrls: ['./payment-configurations.component.scss']
})
export class PaymentConfigurationsComponent {

  @Input() setting_detail:any;
  @Output() payment_data = new EventEmitter<any>();
  @ViewChild('paymentConfigurationModal', { static: true }) paymentConfigurationModal: PaymentConfigurationModalComponent;

  constructor(public _helper:Helper) { }

  //open modal
  showpaymentConfigurationModal() {
    this.paymentConfigurationModal.show(this.setting_detail);
  }

  //emit data
  getSettingData(){
    this.payment_data.emit();
  }

}
