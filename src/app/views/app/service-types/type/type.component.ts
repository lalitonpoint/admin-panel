import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceTypeModalComponent } from 'src/app/containers/pages/service-type-modal/service-type-modal.component';
import { ServiceTypeService } from 'src/app/services/service-type.service';
import { Helper } from 'src/app/shared/helper';
@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss']
})
export class TypeComponent implements OnInit {
  showOrderBy = false;
  showSearch = false;
  showItemsPerPage = false;
  showDisplayMode = false;
  showdropdown = false;
  search_value:any;
  listData:any [] = [];

  @ViewChild('addNewModalRef8', { static: true }) addNewModalRef8: ServiceTypeModalComponent;

  constructor(private serviceType:ServiceTypeService,public helper:Helper) { }

  ngOnInit(): void {
    this.Init();
  }

  Init(){
    this.serviceType.typeList().then(response => {
      this.listData=response.type_list;
    });
  }

  showAddNewModal(): void{
    this.addNewModalRef8.show('');
  }

  editType(data){
   this.addNewModalRef8.show(data);
  }
}
