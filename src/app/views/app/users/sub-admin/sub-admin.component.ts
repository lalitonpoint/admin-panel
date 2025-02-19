import { Component, HostListener, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { SubAdminService } from 'src/app/services/sub-admin.service';
import { Helper } from 'src/app/shared/helper';
import { SubAdminUrl } from 'src/app/shared/sub-admin-url';
import { SubAdminModalComponent } from '../../../../containers/pages/sub-admin-modal/sub-admin-modal.component';

@Component({
  selector: 'app-sub-admin',
  templateUrl: './sub-admin.component.html',
  styleUrls: ['./sub-admin.component.scss']
})
export class SubAdminComponent implements OnInit {
  delete_admin: BsModalRef;
  sub_admin_url: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-md modal-dialog-centered'
  };
  modalConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  admin_list: any;
  selected_admin: any = '';
  admin_urls: any[] = [];
  subadmin_url_list: any[] = [];

  @ViewChild('subAdminModal', { static: true }) subAdminModal: SubAdminModalComponent;

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.code === 'Escape') {
      this.sub_admin_url?.onHidden.subscribe(() => {
        this.closeSubAdminUrlModal();
      })
    }
  }

  constructor(private _subAdminService: SubAdminService, public _helper: Helper, private modalService: BsModalService,private _subAdminUrl:SubAdminUrl ) { }

  ngOnInit(): void {
    this.adminList();
    this.admin_urls = this._subAdminUrl.url_array;
  }

  showAdminModal() {
    this.subAdminModal.show(JSON.parse(JSON.stringify(this.selected_admin)));
  }

  adminList() {
    this._subAdminService.adminList().then((response) => {
      this.admin_list = response.admin_list;
    })
  }

  onEdit(admin) {
    this.selected_admin = admin;
    this.showAdminModal();
    this.selected_admin = '';
  }

  subAdminUrlModal(modal: TemplateRef<any>, admin) {
    this.sub_admin_url = this.modalService.show(modal, this.config);
    this.selected_admin = admin;
    
    admin.url_array.forEach(url => {
      this.admin_urls.forEach(admin_url => {
        if(url.url == admin_url.value){          
          this.subadmin_url_list.push({
            url:admin_url.label,
            permission:url.permission
          })
        }
      })
    })
  }

  closeSubAdminUrlModal(){
    this.sub_admin_url?.hide();
    setTimeout(() => {
      this.subadmin_url_list = [];
      this.selected_admin = '';
    }, 500);
  }

  onDelete(modal: TemplateRef<any>, admin) {
    this.delete_admin = this.modalService.show(modal, this.modalConfig);
    this.selected_admin = admin;
  }

  onDeleteAdmin(){
    let json:any = {id:this.selected_admin._id}
    this._subAdminService.deleteAdmin(json).then((response) => {
      if(response){
        this.selected_admin = '';
        this.delete_admin.hide();
        this.adminList();
      }
    })
  }

}
