import { Component, OnInit, ViewChild } from '@angular/core';
import { VehicleModalComponent } from 'src/app/containers/pages/vehicle-modal/vehicle-modal.component';
import { BrandModalComponent } from 'src/app/containers/pages/brand-modal/brand-modal.component';
import { CountryService } from 'src/app/services/country.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { Helper } from 'src/app/shared/helper';
import { ManageVehicleService } from 'src/app/services/manage-vehicle.service';

@Component({
  selector: 'app-manage-vehicle',
  templateUrl: './manage-vehicle.component.html',
  styleUrls: ['./manage-vehicle.component.scss'],
})
export class ManageVehicleComponent implements OnInit {
  darkTheme = localStorage.getItem('vien-themecolor');
  darkMode: boolean = false;
  itemOptionsPerPage = [];
  itemsPerPage: number;
  vehicle_detail: Array<any> = [];
  current_page: number = 1;
  total_page: number;
  tab_number: number = 1;
  brand_list: any[] = [];
  country_list: any = [];
  country: any = null;
  vehicle_type: any = null;
  filteredvehicleType: any[] = [];
  vehicleType: any[] = [];
  type: any;
  brand_name: any;
  brand_modal: any;
  filtered_brand_modal_list: any[] = [];
  brand_modal_list: any[] = [];
  plate_no: any;
  year: any;
  is_clear_filter_disabled: boolean = true;

  @ViewChild('addNewVehicleModal', { static: true }) addNewVehicleModal: VehicleModalComponent;
  @ViewChild('brandModal', { static: true }) brandModal: BrandModalComponent;

  constructor(public _helper: Helper,private _vehicleService: VehicleService,private _countryService: CountryService,private _manageVehicleService:ManageVehicleService) {}

  ngOnInit(): void {
    this.itemsPerPage = this._helper.USERS_PER_PAGE_LIST[0];
    this.itemOptionsPerPage = this._helper.USERS_PER_PAGE_LIST;
    this.getAdminVehicleList();
    this.getCountryList();
    this.getServiceTypeList();
    this.getVehicleBrandModel();
    if (this.darkTheme.startsWith('dark')) {
      this.darkMode = true;
    }
  }

  getAdminVehicleList() {
    let json = {
      page_no: this.current_page,
      item_per_page: this.itemsPerPage,
      countryid: this.country,
      vehicle_type: this.vehicle_type,
      typeid: this.type,
      brand_id: this.brand_name,
      model_id: this.brand_modal,
      plate_no: this.plate_no,
      passing_year: this.year,
    };

    this._vehicleService.getAdminVehicles(json).then((res: any) => {
      this.vehicle_detail = res.vehicle_list;
      this.total_page = res.total_page;
    });
  }

  getCountryList() {
    this._countryService.fetchCountry().then((res) => {
      if (res.success) {
        this.country_list = res.country_list;
      } else {
        this.country_list = [];
      }
    });
  }

  getServiceTypeList() {
    this._vehicleService.fetch_vehicle_admin_types().then((res: any) => {
      this.vehicleType = res.types;
      this.filteredvehicleType = res.types;
    });
  }

  openAddVehicleModal(details, history = false): void {
    this.addNewVehicleModal.show(details, history);
  }

  openbrandModal(details) {
    this.brandModal.show(details);
  }

  //when change page limit
  onChangeItemsPerPage(item) {
    if (this.total_page >= this.current_page) {
      this.current_page = 1;
    }
    this.itemsPerPage = item;
    this.country = null;
    this.vehicle_type = null;
    this.type = null;
    this.brand_name = null;
    this.brand_modal = null;
    this.plate_no = null;
    this.year = null;
    this.is_clear_filter_disabled = true;
    this.getAdminVehicleList();
  }

  onChangeCountry() {
    this.is_clear_filter_disabled = false;
  }

  updateVehicle(vehicle): void {
    vehicle.is_edit = true;
    this.addNewVehicleModal.show(vehicle);
  }

  pageChanged(event) {
    this.current_page = event;
    this.getAdminVehicleList();
  }

  onSelectTab(tab_number: number) {
    this.tab_number = tab_number;
    if (tab_number == 2) {
      this.getVehicleBrandModel();
    }
  }

  getVehicleBrandModel() {
    let json: any = { type: this._helper.BRAND.BRAND };
    this._manageVehicleService.getVehicleBrandModel(json).then((response) => {
        this.brand_list = response.list;
      });
  }

  changeVehicleType(vehicle_type) {
    this.filterVehicleTypeList(vehicle_type);
    this.is_clear_filter_disabled = false;
  }

  onChangeType() {
    this.is_clear_filter_disabled = false;
  }

  filterVehicleTypeList(vehicle_type) {
    if (vehicle_type == this._helper.VEHICLE_TYPE.EV) {
      this.filteredvehicleType = this.vehicleType.filter(
        (vehicle) => vehicle.vehicle_type == this._helper.VEHICLE_TYPE.EV
      );
    } else {
      this.filteredvehicleType = this.vehicleType.filter(
        (vehicle) => vehicle.vehicle_type == this._helper.VEHICLE_TYPE.NORMAL
      );
    }
  }

  onCHangeBrandName(brand_id) {
    let brand = this.brand_list.filter((brand) => brand._id == brand_id);
    this.getVehicleBrand(brand[0]);
    this.is_clear_filter_disabled = false;
  }

  onChangeModel() {
    this.is_clear_filter_disabled = false;
  }

  getVehicleBrand(brand) {
    this.brand_modal = null;
    let json: any = {
      type: this._helper.BRAND.BRAND_MODEL,
      brand_id: brand._id,
    };
    this._manageVehicleService.getVehicleBrandModel(json).then((response) => {
        this.brand_modal_list = response.list;
      });
  }

  filterBrandModalList() {
    if (this.brand_modal_list.length > 0) {
      this.filtered_brand_modal_list = this.brand_modal_list.filter(
        (brand_modal) => brand_modal.vehicle_type == this.vehicle_type
      );
    } else {
      this.filtered_brand_modal_list = [];
    }
  }

  plateNoSearch() {
    if (this.plate_no !== '') {
      this.is_clear_filter_disabled = false;
    }
  }

  yearChange() {
    if (this.year !== '') {
      this.is_clear_filter_disabled = false;
    }
  }

  apply() {
    if (this.total_page >= this.current_page) {
      this.current_page = 1;
    }

    this.getAdminVehicleList();
  }

  clear() {
    this.country = null;
    this.vehicle_type = null;
    this.type = null;
    this.brand_name = null;
    this.brand_modal = null;
    this.plate_no = null;
    this.year = null;
    this.is_clear_filter_disabled = true;
    this.filteredvehicleType = this.vehicleType;
    this.brand_modal_list = [];
    if (this.total_page >= this.current_page) {
      this.current_page = 1;
    }
    this.getAdminVehicleList();
  }
}
