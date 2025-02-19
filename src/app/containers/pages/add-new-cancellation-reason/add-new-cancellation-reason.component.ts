import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CancellationReasonService } from 'src/app/services/cancellationreason.service';
import { Helper } from 'src/app/shared/helper';
import { LangService } from 'src/app/shared/lang.service';

@Component({
  selector: 'app-add-new-cancellation-reason',
  templateUrl: './add-new-cancellation-reason.component.html',
  styleUrls: ['./add-new-cancellation-reason.component.scss']
})
export class AddNewCancellationReasonComponent implements OnInit {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  cancellationReasonForm: UntypedFormGroup
  formData: FormData;
  is_edit: boolean = false
  reason_array : any ;
  user_type: any = this._helper.PANEL_TYPE.USER;
  
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  constructor(private _helper: Helper , private modalService : BsModalService,  public _lang: LangService ,  private _cancellationReasonService: CancellationReasonService,) { }

  ngOnInit(): void {
    this._initForm();
  }

  show(reason = null, user_type = null): void {
    this.modalRef = this.modalService.show(this.template, this.config);
    this.formData = new FormData()
    this.user_type = user_type;
    this._initForm()
    if (reason) {
      this.is_edit = true
      this.reason_array = reason;
      this.cancellationReasonForm.patchValue({
        reason: reason.reason,
        reason_id : reason._id
      })
      // this.getCancellationReasons(reason_id)
    }
  }

  _initForm() {
    this.cancellationReasonForm = new UntypedFormGroup({
      reason: new UntypedFormArray([]),
      reason_id: new UntypedFormControl(null),
      user_type: new UntypedFormControl(Number(this.user_type)),
    })

    this.cancellationReasonForm.value.user_type = this.user_type;
    this._lang.supportedLanguages.forEach(_language => {
      if (_language.code == "en") {
        this.reason.push(new UntypedFormControl("", Validators.required))
      } else {
        this.reason.push(new UntypedFormControl(""))
      }
    })
  }

  get reason() {
    return this.cancellationReasonForm.get('reason') as UntypedFormArray;
  }

  save() {
    const reasonArray = this.cancellationReasonForm.get('reason') as UntypedFormArray;
    for (let i = 0; i < reasonArray.length; i++) {
      const reasonControl = reasonArray.at(i) as UntypedFormControl;
      const trimmedValue = reasonControl.value.trim();
      reasonControl.setValue(trimmedValue);
    }

    if(this.cancellationReasonForm.invalid){
      return this.cancellationReasonForm.markAllAsTouched();
    }
    if (this.cancellationReasonForm.valid) {
      
      if (!this.cancellationReasonForm.value.reason_id) {
        this._cancellationReasonService.addCancellationReason(this.cancellationReasonForm.value)
      } else {
        this.formData.append('reason_id', this.cancellationReasonForm.value.reason_id)
        this._cancellationReasonService.updateCancellationReason(this.cancellationReasonForm.value)
      }

      this.modalRef.hide()
      this.cancellationReasonForm.reset()
    }
  }

  close(){
    this.is_edit = false;
    this.modalRef.hide();
    this.cancellationReasonForm.reset()
  }

}
