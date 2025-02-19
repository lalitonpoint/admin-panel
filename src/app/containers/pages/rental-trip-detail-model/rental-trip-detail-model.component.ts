import { Component, EventEmitter, HostListener, Output, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DEFAULT_IMAGE, RENTAL_TRIP_STATUS } from 'src/app/constants/constants';
import { ChatService } from 'src/app/services/chat.service';
import { RequestService } from 'src/app/services/request.service';
import { SocketService } from 'src/app/services/sockert.service';
import { Helper } from 'src/app/shared/helper';
import { environment } from 'src/environments/environment';
import * as html2pdf from 'html2pdf.js';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rental-trip-detail-model',
  templateUrl: './rental-trip-detail-model.component.html',
  styleUrls: ['./rental-trip-detail-model.component.scss']
})
export class RentalTripDetailModelComponent {
  modalRef: BsModalRef;
  refundModelRef: BsModalRef;
  confirmModelRef: BsModalRef;
  confirmEmailModelRef: BsModalRef;
  tripdetail: any;
  trip_id: string;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  refundModelConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  timezone_for_display_date: string = '';
  status: number;
  IMAGE_URL = environment.IMAGE_URL;
  DEFAULT_IMAGE = DEFAULT_IMAGE.USER_PROFILE;
  RENTAL_TRIP_STATUS = RENTAL_TRIP_STATUS;
  buttonDisabled = false;
  buttonState = '';
  selectedPaymentType: number = 1;
  walletAmount: number;
  walletSelecteType: boolean = false;
  is_refund_show = false;
  chatSubscription: Subscription;
  chats: any = [];

  @Output() trip_data = new EventEmitter<any>();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  @ViewChild('refundTemplate', { static: true }) refundTemplate: TemplateRef<any>;
  @ViewChild('confirmationEmail', { static: true }) confirmationEmail: TemplateRef<any>;
  @ViewChild('confirmationTemplate', { static: true }) confirmationTemplate: TemplateRef<any>;

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.code === 'Escape') {
      this.modalRef?.onHidden.subscribe(() => {
        this.closemodal();
      })
    }
  }
  constructor(private _socket: SocketService, private modalService: BsModalService, public _helper: Helper, private _chatService: ChatService, private _requestService: RequestService) { }

  //open modal and get trip data from id
  show(id, status, timezone_for_display_date = null, is_refund_show = false): void {
    if (timezone_for_display_date) {
      this.timezone_for_display_date = timezone_for_display_date;
    } else {
      this._helper.display_date_timezone.subscribe(data => {
        if (data) {
          this.timezone_for_display_date = data;
        }
      })
    }
    setTimeout(() => {
      this.trip_id = id;
      this.status = status;
      this.is_refund_show = is_refund_show;
      this.getTripDetails();
      this.getChatHistory();
      this.modalRef = this.modalService.show(this.template, this.config);
    }, 250);
  }

    //get trip data
    getTripDetails(from_socket = false) {
      let json: any = { trip_id: this.trip_id }
      this._requestService.getRentalTripDetails(json).then(res => {
        if (res.success) {
          this.tripdetail = res.trip_detail[0];
          const tripStatus = res.trip_detail[0].trip_status;
          tripStatus?.sort((a, b) => {
            return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          });
          this.tripdetail.trip_status = tripStatus;
        }
      })
    }

  closemodal() {
    this._socket.disconnectSocket(`'${this.trip_id}'`)
    setTimeout(() => {
      this.trip_id = "";
      this.modalRef?.hide();
      this.trip_id = "";
      this.chatSubscription?.unsubscribe();
      this._chatService?.clearSubscription();
    }, 200);
  }

  //get chat history
  getChatHistory() {
    this._chatService.readChat(this.trip_id)
    this.chatSubscription = this._chatService._chatObservable.subscribe((data: any) => {
      if (data) {
        let chats = [];
        Object.keys(data).forEach((element: any) => {
          let newObject = data[element];
          Object.keys(newObject).forEach((ele: any) => {
            chats.push(newObject[ele]);
          })
          this.chats = chats;
        })
      } else {
        this.chats = [];
      }
    })
  }

  //cancel trip modal
  cancelTrip() {
    this.confirmModelRef = this.modalService.show(this.confirmationTemplate, this.refundModelConfig);
  }

  //cancel trip
  confirm() {
    let json: any = { trip_id: this.trip_id }
    this._requestService.cancelRentalTrip(json).then(res => {
      if (res.success) {
        this.trip_data.emit();
        this.closemodal();
        this.cancel();
      }
    })
  }

  //cancel trip modal close
  cancel() {
    this.confirmModelRef.hide()
  }

  sendMail() {
    this.confirmEmailModelRef = this.modalService.show(this.confirmationEmail, this.refundModelConfig);
    this.modalRef.hide();
  }

  confirmEmail() {
    let json = {
      trip_id: this.tripdetail._id,
      receiverMail: this.tripdetail.user_details.email
    }
    this._requestService.send_invoice_mail(json).then(res => {
      this.confirmEmailModelRef.hide();
    })
  }

  downloadPdf() {
    this.buttonDisabled = true;
    this.buttonState = 'show-spinner';

    const element = document.getElementById('htmlContent');
    const clonedElement = element.cloneNode(true) as HTMLElement;

    const targetDiv = clonedElement.querySelector('#test_trip');
    const additionalContentElement = document.createElement('div');
    additionalContentElement.innerHTML = `
    <div class="row d-flex flex-row justify-content-start justify-content-around mb-3">
    <div class="text-center ">
    <p class="text-center mb-1" style="font-size: large;font-weight: bold;">Trip ID : `+ this.tripdetail.unique_id + `</p>
    </div>
    </div>
    `;
    // Append the new HTML content to the cloned element
    targetDiv.appendChild(additionalContentElement);

    const date = Math.floor(new Date().getTime() / 1000);

    const options = {

      filename: date + this.tripdetail.invoice_number + '.pdf',
      margin: [10, 20, 10, 20],

    };

    html2pdf().set(options).from(clonedElement).toPdf().save().then(() => {
      this.buttonState = '';
      this.buttonDisabled = false;
    }).catch((error) => {
      console.error('Error generating PDF', error);
    });
  }

  // refund trip amount model
  refund() {
    this.modalRef.hide();
    this.refundModelRef = this.modalService.show(this.refundTemplate, this.refundModelConfig);
  }

  // close refund model
  closeRefundModal() {
    this.refundModelRef.hide();
    setTimeout(() => {
      this.selectedPaymentType = 1;
      this.walletAmount = null;
      this.walletSelecteType = false;
      this.trip_id = "";
    }, 1000);
  }

  // payment type wallet / card
  refundPaymentType(paymentType) {
    if (paymentType == 1) {
      this.walletSelecteType = true
    } else {
      let json: any = { trip_id: this.trip_id, type: this.selectedPaymentType }
      this._requestService.refundRentalTripAmount(json).then(res => {
        if (res.success) {
          this.trip_data.emit();
          this.closeRefundModal();
        }
      })
    }
  }

  // wallet amount
  refundWallet() {
    let json: any = { trip_id: this.trip_id, type: this.selectedPaymentType, amount: this.walletAmount }
    this._requestService.refundRentalTripAmount(json).then(res => {
      if (res.success) {
        this.walletAmount = null;
        this.trip_data.emit();
        this.closeRefundModal();
      }
    })
  }

}
