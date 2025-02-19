import { Component, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PromoService } from 'src/app/services/promo.service';
import { Helper } from 'src/app/shared/helper';

export class PromoDetail {
  promocode:string;
  code_value:number;
  code_type:number;
  country_details:CountryDatail = new CountryDatail();
}

export class CountryDatail{
  countryname:string;
}

@Component({
  selector: 'app-promo-code-modal',
  templateUrl: './promo-code-modal.component.html',
  styleUrls: ['./promo-code-modal.component.scss']
})
export class PromoCodeModalComponent {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  promo_detail:PromoDetail = new PromoDetail();
  used_promo_array:any;

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService,private _promoService:PromoService,public _helper:Helper) { }

  //open modal and get promo used data from promo id
  show(promo_id): void {
    let json:any = {promo_id:promo_id}
    this._promoService.promoUsedInfo(json).then(res => {
      if(res.success){
        this.promo_detail = res.promo_detail;
        this.used_promo_array = res.used_promo_array;
      }
    })
    this.modalRef = this.modalService.show(this.template, this.config);
  }
}
