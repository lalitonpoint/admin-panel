import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Helper } from 'src/app/shared/helper';
import { environment } from 'src/environments/environment';
import { DEFAULT_IMAGE } from 'src/app/constants/constants';

@Component({
  selector: 'app-review-details-modal',
  templateUrl: './review-details-modal.component.html',
  styleUrls: ['./review-details-modal.component.scss']
})
export class ReviewDetailsModalComponent implements OnInit {

  modalRef: BsModalRef;
  config = {backdrop: true,ignoreBackdropClick: true,class: 'modal-right'};
  IMAGE_URL = environment.IMAGE_URL;
  USER_DEFAULT_IMAGE = DEFAULT_IMAGE.USER_PROFILE;
  reviewDetail:any;
  timezone_for_display_date:string = '';
  
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private modalService: BsModalService,public _helper:Helper) { }

  ngOnInit(): void {
    this._helper.display_date_timezone.subscribe(data => {
      this.timezone_for_display_date = data;
    })
  }

  //open modal
  show(reviewDetail): void {
    this.reviewDetail = reviewDetail;
    this.modalRef = this.modalService.show(this.template, this.config);
  }

}
