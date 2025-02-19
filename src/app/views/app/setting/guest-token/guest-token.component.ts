import { GUEST_TOKEN } from './../../../../constants/constants';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GuestTokenModalComponent } from 'src/app/containers/pages/guest-token-modal/guest-token-modal.component';
import { Helper } from 'src/app/shared/helper';
import { GuestTokenService } from 'src/app/services/guest-token.service';

@Component({
  selector: 'app-guest-token',
  templateUrl: './guest-token.component.html',
  styleUrls: ['./guest-token.component.scss'],
})
export class GuestTokenComponent implements OnInit {
  itemSearch = { label: 'label-title.promo_code', value: 'promo_code' };
  itemSort = { label: 'label-title.country', value: 'country' };
  itemSortBy = { label: 'label-title.descending', value: 'descending' };
  itemUser = { label: 'label-title.all', value: 'all' };
  itemOptionsSearch = [
    { label: 'label-title.city', value: 'city' },
    { label: 'label-title.country', value: 'country' },
    { label: 'label-title.promo_code', value: 'promo_code' },
  ];
  itemOptionsSort = [
    { label: 'label-title.country', value: 'country' },
    { label: 'label-title.name', value: 'name' },
  ];
  itemOptionsSortBy = [
    { label: 'label-title.descending', value: 'descending' },
    { label: 'label-title.ascending', value: 'ascending' },
  ];
  itemsPerPage = 5;
  itemOptionsPerPage = [5, 10, 20];
  guestTokenList: any;
  GUEST_TOKEN = GUEST_TOKEN;
  selected_type = GUEST_TOKEN.RUNNING

  @ViewChild('GuestTokenModalRef', { static: true }) GuestTokenModalRef: GuestTokenModalComponent;

  constructor(public _helper: Helper,private _guestTokenService: GuestTokenService) {}

  ngOnInit(): void {
    this._helper.setting_details.subscribe((res) => {
      if (res) {
        this._guestTokenService._tokenObservable.subscribe((res) => {
          this.getGuestToken(this.selected_type);
        });
      }
    });
  }

  //get promo using page type
  getGuestToken(type) {
    this.selected_type = type ;
    let json: any = { page_type: type };
    this._guestTokenService.get_guest_token(json).then((res: any) => {
      this.guestTokenList = res.guest_tokens_list;
    });
  }

  //open promo add and edit modal
  showAddNewModal(token): void {
    this.GuestTokenModalRef.show(token);
  }
}
