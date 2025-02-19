import { Component, Input, OnChanges, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RentalPackageSettingModalComponent } from 'src/app/containers/pages/rental-package-setting-modal/rental-package-setting-modal.component';
import { TypeCityAssociationService } from 'src/app/services/type-city-association.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-trip-rental',
  templateUrl: './trip-rental.component.html',
  styleUrls: ['./trip-rental.component.scss']
})
export class TripRentalComponent implements OnChanges {
  rentalModalRef: BsModalRef;
  confirmationModalConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  rental_data:any [] = [];
  btnDisable:boolean;
  deleteRentalData:any;

  @Input() unit:any;
  @Input() currencysign:any;
  @Input() cityid: any;
  @Input() service_type_id: any;
  @ViewChild('rentalPackageSettingModal', { static: true }) rentalPackageSettingModal: RentalPackageSettingModalComponent;
  @ViewChild('deleteRentalTemplate', { static: true }) deleteRentalTemplate: TemplateRef<any>;

  constructor(public _helper:Helper,private typeCityService: TypeCityAssociationService, private modalService: BsModalService) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.getRentalList();
  }

  //get rental list
  getRentalList(){
    let josn: any = { cityid: this.cityid, service_type_id: this.service_type_id }
    this.typeCityService.fetchRenatlPrice(josn).then(res => {
      if (res.success) {    
        this.rental_data = res.car_rental_list;
      } else {
        this.rental_data = []
      }
    })
  }

  //data pass to child 
  showRentalPackageModal(data): void{
    this.rentalPackageSettingModal.show(data,this.cityid,this.service_type_id,this.currencysign,this.unit);
  }

  //add rental packge
  addRentalPackage(): void {
    this.rentalPackageSettingModal.show('',this.cityid,this.service_type_id,this.currencysign,this.unit)
  }

  //delete rental package
  deleteRental(id) {
    this.btnDisable = true;
    let josn :any = {delete_car_rental_id:id,cityid:this.cityid,service_type_id:this.service_type_id}
    this.typeCityService.deleteRenatlPackage(josn).then(res => {
      if (res.success) {
        this.getRentalList();
        this.rentalModalRef.hide()
        setTimeout(() => {
          this.btnDisable = false;
        }, 500);
      }else{
        this.btnDisable = false;
      }
    })
  }

  // open model delete rental package
  deleteRentalModel(data){
    this.deleteRentalData=data;
    this.rentalModalRef = this.modalService.show(this.deleteRentalTemplate, this.confirmationModalConfig);
  }
}
