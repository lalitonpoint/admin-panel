import { Component,  TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BannerService } from 'src/app/services/banner.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-add-banner-modal',
  templateUrl: './add-banner-modal.component.html',
  styleUrls: ['./add-banner-modal.component.scss']
})
export class AddBannerModalComponent {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };

  action_type = [
    { label : 'Link' , value : 'a'},
    { label : 'Button' , value :  'button'}
  ]

  bannerForm : FormGroup;
  banner : any ;
  is_edit:boolean=false;
  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  BannerService
  constructor(private modalService: BsModalService,public _helper: Helper, private bannerSerivce: BannerService) { }

  show(is_edit : boolean , banner : any){    
    this.modalRef = this.modalService.show(this.template , this.config);
    this._initForm();
    this.is_edit = is_edit ;
    if(is_edit){
      this.banner = banner;
      this.bannerForm.patchValue({...banner})
    }
  }

  _initForm(){
    this.bannerForm = new UntypedFormGroup({
      banner_title: new UntypedFormControl(null, Validators.required),
      redirect_url: new UntypedFormControl(null, Validators.required),
      action_link: new UntypedFormControl("a"),
      action_text: new UntypedFormControl(null, Validators.required),
      is_visible: new UntypedFormControl(false, Validators.required)
    })
  }

  closeModal(){
    this.modalRef.hide()
    this.bannerForm.reset()
    this.is_edit = false;
  }

  submit(){
    if (this.bannerForm.invalid) {
      return this.bannerForm.markAllAsTouched();
    }

    let json = this.bannerForm.value; 

    if(this.is_edit && this.banner){
      json = { _id: this.banner?._id, ...json };
    }

    let api = this.is_edit ? this.bannerSerivce.update_banner(json) : this.bannerSerivce.add_banner(json)

    api.then((res_data)=>{
      this.bannerSerivce._bannerChanges.next({});
      if (!res_data.success) {
        return;
      }
      this.closeModal();
    })

  }
}
