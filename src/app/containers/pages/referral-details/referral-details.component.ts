import { ReferralService } from './../../../services/referral.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-referral-details',
  templateUrl: './referral-details.component.html',
  styleUrls: ['./referral-details.component.scss']
})
export class ReferralDetailsComponent implements OnInit {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  referralDetails : any ;
  userReferral : any ;
  timezone_for_display_date:string = '';

  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService , private _referralService : ReferralService,public _helper:Helper) { }

  ngOnInit(): void {
    this._helper.display_date_timezone.subscribe(data => {
      this.timezone_for_display_date = data;
    })
  }

  show(json , userReferral){
    this.userReferral = userReferral ;

    this.modalRef = this.modalService.show(this.template, this.config);

    this._referralService.fetchReferralDetails(json).then((res_data : any )=>{
      this.referralDetails = res_data.referral_details ;
    })
  }

  onClose(){
    this.modalRef.hide();
  }

}
