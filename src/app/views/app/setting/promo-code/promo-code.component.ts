import { Component, OnInit, ViewChild } from '@angular/core';
import { AddNewPromoModalComponent } from 'src/app/containers/pages/add-new-promo-modal/add-new-promo-modal.component';
import { PromoCodeModalComponent } from 'src/app/containers/pages/promo-code-modal/promo-code-modal.component';
import { PromoService } from 'src/app/services/promo.service';
import { PROMO_CODE } from 'src/app/constants/constants';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-promo-code',
  templateUrl: './promo-code.component.html',
  styleUrls: ['./promo-code.component.scss']
})
export class PromoCodeComponent implements OnInit {
  darkTheme = localStorage.getItem('vien-themecolor');
  itemSearch = { label: 'label-title.promo_code', value: 'promocode' };
  itemSort = { label: 'label-title.name', value: 'name' };
  itemOptionsSort = [
    { label: 'label-title.name', value: 'name' },
  ];
  itemsPerPage = 5;
  itemOptionsPerPage = [5, 10, 20];
  promo_list: any;
  PROMO_CODE: any = PROMO_CODE;
  page_type: any;
  search_value: string = '';
  current_page: number = 1;
  total_page: number;
  darkMode:boolean=false;
  is_clear_disabled:boolean = true;

  @ViewChild('addNewModalRef', { static: true }) addNewModalRef: AddNewPromoModalComponent;
  @ViewChild('promoCode', { static: true }) promoCode: PromoCodeModalComponent;

  constructor(private _promoService: PromoService, public _helper: Helper) {}

  ngOnInit(): void {
    this.fetchPromoList(PROMO_CODE.RUNNING);

    if(this.darkTheme.startsWith('dark') ){
      this.darkMode=true;
    }
  }

  //get promo list
  fetchPromoList(page_type) {
    this.page_type = page_type;
    let json: any = { page_type: page_type, page: this.current_page, limit: this.itemsPerPage, serach_value: this.search_value, search_item: this.itemSearch.value }
    this._promoService.fetchPromoList(json).then(res => {
      if (res.success) {
        this.promo_list = res.promo_list;
        this.total_page = res.total_page;
      }
    })
  }

  //when change tabs
  changePromoType(page_type){
    this.current_page = 1;
    this.fetchPromoList(page_type);
  }

  //open promo add and edit modal
  showAddNewModal(promo): void {
    this.addNewModalRef.show(promo);
  }

  //open used promo info modal
  showUsedPromoCode(promo_id): void {
    this.promoCode.show(promo_id);
  }

  //change page using pagination
  onPage(event): void {
    this.current_page = event;
    this.fetchPromoList(this.page_type);
  }

  onChangeSortBy(item): void {
    this.itemSort = item;
  }

  //per page change
  onChangeItemsPerPage(item): void {
    if(this.total_page >= this.current_page){
      this.current_page = 1;
    }
    this.itemsPerPage = item;
    this.fetchPromoList(this.page_type);
  }

  //apply
  apply() {
    this.current_page = 1;
    this.fetchPromoList(this.page_type);
  }

  //clear filter
  clear() {
    this.current_page = 1;
    this.search_value = "";
    this.fetchPromoList(this.page_type);
    this.is_clear_disabled = true;
  }

}
