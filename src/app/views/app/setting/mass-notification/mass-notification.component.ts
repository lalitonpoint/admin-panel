import { Component, OnInit, ViewChild } from '@angular/core';
import { MassNotificationModalComponent } from 'src/app/containers/pages/mass-notification-modal/mass-notification-modal.component';
import { MassNotificationService } from 'src/app/services/mass-notification.service';
import { CountryService } from 'src/app/services/country.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-mass-notification',
  templateUrl: './mass-notification.component.html',
  styleUrls: ['./mass-notification.component.scss']
})
export class MassNotificationComponent implements OnInit {
  darkTheme = localStorage.getItem('vien-themecolor');
  data: any;
  itemOrder = { label: 'All', value: 'all' };
  itemOptionsOrders = [
    { label: 'All', value: 'all' },
    { label: 'User', value: '1' },
    { label: 'Provider', value: '2' },
  ];
  itemsPerPage = 20;
  itemOptionsPerPage = [20, 50, 100];
  notification_list:[] = [];
  all_countries: [] = [];
  timezone_for_display_date:string = '';
  current_page:number = 1;
  total_page:number;
  darkMode:boolean=false;
  
  @ViewChild('addNewModalRef', { static: true }) addNewModalRef: MassNotificationModalComponent;

  constructor(private _massNotificationService:MassNotificationService, private _countryService: CountryService,public _helper:Helper) { }

  ngOnInit(): void {
    this.getMassNotificationData();

    //get country list
    this._countryService.fetchCountry().then(res => {
      this.all_countries = res.country_list;
    })

    if(this.darkTheme.startsWith('dark') ){
      this.darkMode=true;
    }
    this._helper.display_date_timezone.subscribe(data => {
      this.timezone_for_display_date = data;
    })
  }

  //get mass notification data
  getMassNotificationData(){
    let json:any = {user_type:this.itemOrder.value,limit:this.itemsPerPage,page :this.current_page}
    this._massNotificationService.massNotificationList(json).then(res => {
      if(res.success){
        this.notification_list = res.notification_list;
        this.total_page = res.total_page;
      }
    })
  }

  //open modal
  showAddNewModal(): void{
    this.addNewModalRef.show();
  }

  //when change from filter by dropdown
  onChangeOrderBy(item): void  {
    this.itemOrder = item;
    this.current_page = 1;
    this.getMassNotificationData();
  }

  //when change per page items
  onChangeItemsPerPage(item){
    if(this.total_page > this.current_page){
      this.current_page = 1;
    }
    this.itemsPerPage = item;
    this.getMassNotificationData();
  }

  //when change page from pagination
  pageChanged(event) {
    this.current_page = event;
    this.getMassNotificationData();
  }

}
