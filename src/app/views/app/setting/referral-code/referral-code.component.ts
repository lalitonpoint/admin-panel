import { ReferralDetailsComponent } from '../../../../containers/pages/referral-details/referral-details.component';
import { ReferralService } from '../../../../services/referral.service';
import { PANEL_TYPE } from '../../../../constants/constants';
import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-referral-code',
  templateUrl: './referral-code.component.html',
  styleUrls: ['./referral-code.component.scss']
})
export class ReferralCodeComponent implements OnInit {
  darkTheme = localStorage.getItem('vien-themecolor');
  itemOrder = { label: 'label-title.id', value: 'unique_id' };
  itemOptionsOrders = [
    { label: 'label-title.id', value: 'unique_id' , isShow : true },
    { label: 'label-title.name', value: 'first_name' , isShow : true },
    { label: 'label-title.email', value: 'email' , isShow : true },
    { label: 'label-title.phone', value: 'phone' , isShow : true },
  ];
  PANEL_TYPE = PANEL_TYPE ;
  type = PANEL_TYPE.USER ;
  data: any;
  search_value: string = '';
  referralList : any ;
  currentPage : number = 1 ;
  count : number ;
  isExelSheet : boolean =  false ;
  darkMode:boolean=false;
  is_clear_disabled:boolean = true;

  changeOrderBy: EventEmitter<any> = new EventEmitter();
  @Input() showItemsPerPage = true;
  @Input() itemsPerPage = 20;
  @Input() itemOptionsPerPage = [];
  @ViewChild('ReferralDetails' , {static : true}) RefferalDetails : ReferralDetailsComponent;

  constructor( private _referralService : ReferralService , public _helper : Helper ) { }

  ngOnInit(): void {
    this.getReferralList();

    this.itemOptionsPerPage = this._helper.PER_PAGE_LIST;
    if(this.darkTheme.startsWith('dark') ){
      this.darkMode=true;
    }
  }

  onChangeOrderBy(user): void {
    this.itemOrder = user;
    this.changeOrderBy.emit(user);
    this.is_clear_disabled = false;
  }

  getReferralList(){
    let json = {
      type : this.type ,
      page : this.currentPage,
      limit : this.itemsPerPage,
      search_item : this.itemOrder.value,
      search_value : this.search_value ,
      is_excel_sheet : this.isExelSheet
    }
    this._referralService.fetchReferralList(json).then((res_data : any)=>{
      this.referralList = res_data.referral_list;
      this.count = res_data.total_page ;
      this.itemOptionsOrders.forEach((data) => {
        if(data.value == 'email' && res_data.is_show_email === false){
          data.isShow = false ;
        }
        if(data.value == 'phone' && res_data.is_show_phone === false){
          data.isShow = false ;
        }
      })
    });
  }

  onChangeItemsPerPage(item): void {
    if(this.count >= this.currentPage){
      this.currentPage = 1;
    }
    this.itemsPerPage = item;
    this.getReferralList();
  }

  changeType(type){
    this.currentPage = 1;
    this.type = type ;
    this.getReferralList();
  }

  apply(value){
    this.currentPage = 1;
    this.search_value = value ;
    this.getReferralList();
  }

  onRefferal(list){
    let json = {
      id : list._id ,
      type : this.type
    }

    this.RefferalDetails.show(json , list) ;
  }

  pageChanged(event){
    this.currentPage = event ;
    this.getReferralList();
  }

  export(){
    this.isExelSheet = true ;
  }

  clear(){
    this.currentPage = 1;
    this.search_value = '' ;
    this.itemOrder = { label: 'label-title.id', value: 'unique_id' } ;
    this.itemsPerPage = 20;
    this.getReferralList();
    this.is_clear_disabled = true;
  }
}
