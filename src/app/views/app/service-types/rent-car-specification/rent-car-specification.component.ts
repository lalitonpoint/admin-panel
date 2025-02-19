import { Component, OnInit, ViewChild } from '@angular/core';
import { RentCarFeatureModelComponent } from 'src/app/containers/pages/rent-car-feature-model/rent-car-feature-model.component';
import { RentCarSpecificationModelComponent } from 'src/app/containers/pages/rent-car-specification-model/rent-car-specification-model.component';
import { CarRentServiceService } from 'src/app/services/car-rent-service.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-rent-car-specification',
  templateUrl: './rent-car-specification.component.html',
  styleUrls: ['./rent-car-specification.component.scss']
})
export class RentCarSpecificationComponent implements OnInit {

  feature_listData: any[] = [];
  specification_listData: any[] = [];
  tab_number: number = 1;
  darkTheme = localStorage.getItem('vien-themecolor');
  darkMode: boolean = false;
  search_value: string = '';
  is_clear_disabled:boolean = true;
  itemOptionsPerPage = [];
  itemsPerPage: number;
  current_page: number = 1;
  total_page: number = 1;

  @ViewChild('addNewFeature', { static: true }) addNewFeature: RentCarFeatureModelComponent;
  @ViewChild('addNewSpecification', { static: true }) addNewSpecification: RentCarSpecificationModelComponent;
  constructor(public _helper: Helper, private _carRentServiceService: CarRentServiceService) { }

  ngOnInit(): void {
    this.itemsPerPage = this._helper.USERS_PER_PAGE_LIST[0];
    this.itemOptionsPerPage = this._helper.USERS_PER_PAGE_LIST;
    this.Init();
    if (this.darkTheme.startsWith('dark')) {
      this.darkMode = true;
    }
  }

  Init() {
    if (this.tab_number == 1) {
      let json = {
        page_no: this.current_page,
        item_per_page: this.itemsPerPage,
        search_value: this.search_value
      };
      this._carRentServiceService.carRentFeatureList(json).then(response => {
        this.feature_listData = response.car_rent_feature_list;
        this.total_page = response.total_page;
      });
    } else {
      let json = {
        page_no: this.current_page,
        item_per_page: this.itemsPerPage,
        search_value: this.search_value
      };
      this._carRentServiceService.carRentSpecificationList(json).then(response => {
        this.specification_listData = response.car_rent_specification_list;
        this.total_page = response.total_page;
      });
    }
  }

  openAddFeatureModal(): void {
    this.addNewFeature.show('');
  }

  editFeature(data) {
    this.addNewFeature.show(data);
  }

  openAddSpecificationModal(): void {
    this.addNewSpecification.show('');
  }

  editSpecification(data) {
    this.addNewSpecification.show(data);
  }

  onSelectTab(tab_number: number) {
    this.tab_number = tab_number;
    this.Init();
  }

  //apply filter
  apply() {
    this.is_clear_disabled = false;
    this.current_page = 1;
    this.Init();
  }

  //clear filter
  clear() {
    this.search_value = '';
    this.current_page = 1;
    this.itemsPerPage = 15;
    this.Init();
    this.is_clear_disabled = true;
  }

  //when change page limit
  onChangeItemsPerPage(item) {
    if(this.total_page >= this.current_page){
      this.current_page = 1;
    }
    this.itemsPerPage = item;
    this.Init();
  }

  pageChanged(event) {
    this.current_page = event;
    this.Init();
  }
  
}
