import { Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TypeCityAssociationService } from 'src/app/services/type-city-association.service';
import { Helper } from 'src/app/shared/helper';
@Component({
  selector: 'app-add-new-place-modal',
  templateUrl: './add-new-place-modal.component.html',
  styleUrls: ['./add-new-place-modal.component.scss']
})
export class AddNewPlaceModalComponent {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  rich_area_surge_list: any;
  cityid: string;
  service_type_id: string;
  btnDisable: boolean;
  errorShow:boolean;
  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  @Output() parentHandler: EventEmitter<any> = new EventEmitter();

  constructor(public _helper:Helper,private modalService: BsModalService,private typeCityService :TypeCityAssociationService) { }

  show(rich_area_surge, cityid, service_type_id): void {
    this.cityid = cityid;
    this.service_type_id = service_type_id
    this.rich_area_surge_list = JSON.parse(JSON.stringify(rich_area_surge));
    this.modalRef = this.modalService.show(this.template, this.config);
  }
  //update rich area surge 
  updateRichArea(data) {
    // Reset all error states
    data.forEach(surge => {
      surge.isErrorRequired = false;
      surge.isErrorMaxValue = false;
    });

    // Check if any surge_multiplier is null or empty and set the error on the specific item
    const hasRequiredError = data.some(surge => {
      if (surge.surge_multiplier == null || surge.surge_multiplier === '' || surge.surge_multiplier <= 0) {
        surge.isErrorRequired = true;
        return true;
      }
      return false;
    });

    if (hasRequiredError) return;

    // Check if any surge_multiplier exceeds the maximum allowed value and set the error on the specific item
    const hasMaxValueError = data.some(surge => {
      if (surge.surge_multiplier > 100) {
        surge.isErrorMaxValue = true;
        return true;
      }
      return false;
    });

    if (hasMaxValueError) return;

    if (data) {
      this.btnDisable = true;
      let josn: any = { rich_surge_price: data, cityid: this.cityid, service_type_id: this.service_type_id }
      this.typeCityService.deleteRenatlPackage(josn).then(res => {
        if (res.success) {
          this.close();
          setTimeout(() => {
            this.btnDisable = false;
          }, 500);
        } else {
          this.btnDisable = false;
        }
      })
    }
  }
  close() {
    this.parentHandler.emit();
    this.modalRef.hide()
    this.errorShow = false;
    setTimeout(() => {
      this.rich_area_surge_list = null;
    }, 1000);
  }

}
