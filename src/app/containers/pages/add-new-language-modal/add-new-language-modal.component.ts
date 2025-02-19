import { Component, OnInit, TemplateRef, ViewChild, Output, EventEmitter, OnDestroy, HostListener } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LanguageService } from 'src/app/services/language.service';
import { NotifiyService } from 'src/app/services/notifier.service';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-add-new-language-modal',
  templateUrl: './add-new-language-modal.component.html',
  styleUrls: ['./add-new-language-modal.component.scss']
})
export class AddNewLanguageModalComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: 'modal-right'
  };
  languageForm: UntypedFormGroup;
  form_data: FormData;
  show_file_error: boolean = false;
  is_edit: boolean = false;
  admin_url: any = '';
  
  @Output() lang_data = new EventEmitter<any>();
  @ViewChild('template', { static: true }) template: TemplateRef<any>;

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape' || event.code === 'Escape') {
      this.modalRef?.onHidden.subscribe(() => {
        this.closeModal();
      })
    }
  }

  constructor(private modalService: BsModalService, private _languageService: LanguageService, private _helper: Helper, private _notifiyService: NotifiyService) { }

  ngOnInit(): void {
    this.languageForm = new UntypedFormGroup({
      name: new UntypedFormControl(null, Validators.required),
      code: new UntypedFormControl(null, Validators.required),
      is_lang_rtl: new UntypedFormControl(false),
      files: new UntypedFormControl(null, Validators.required)
    })
  }

  show(): void {
    this.is_edit = false
    this.modalRef = this.modalService.show(this.template, this.config);
    this.form_data = new FormData
  }

  edit(language): void {
    this.is_edit = true
    this.languageForm = new UntypedFormGroup({
      name: new UntypedFormControl(language.name, Validators.required),
      code: new UntypedFormControl(language.code, Validators.required),
      is_lang_rtl: new UntypedFormControl(language.is_lang_rtl),
      files: new UntypedFormControl(null)
    })
    this.modalRef = this.modalService.show(this.template, this.config);
    this.form_data = new FormData
    this.form_data.append('_id', language._id)
  }

  onSelectImageFile(event, type) {
    const files = event.target.files;
    if (files.length === 0)
      return;
    const mimeType = files[0].type;
    if (mimeType.match(/json\/*/) == null) {
      this._notifiyService.showNotification('error', this._helper.trans.instant('validation-title.only-JSON-are-supported'))
      this.show_file_error = true;
      return;
    }
    const fileReader = new FileReader();
    this.admin_url = files[0].name
    fileReader.readAsText(files[0], "UTF-8");
    fileReader.onload = () => {
      this.form_data.append('files', files[0]);
      this.show_file_error = false;
    }
    fileReader.onerror = (error) => {
    }
  }

  closeModal() {
    this.modalRef?.hide();
    this.admin_url = '';
    setTimeout(() => {
      this.languageForm.reset();
      this.show_file_error = false;
    }, 500);
  }

  submit() {
    if (this.languageForm.invalid || this.show_file_error) {
      this.languageForm.markAllAsTouched();
    }
    if (this.languageForm.valid) {
      this.form_data.append('name', this.languageForm.value.name)
      this.form_data.append('code', this.languageForm.value.code)
      this.form_data.append('is_lang_rtl', this.languageForm.value.is_lang_rtl)
      if (this.is_edit) {
        this.form_data.append('files', null);
        this._languageService.editLanguage(this.form_data).then(res => {
          this.form_data = new FormData;
          this.closeModal();
          this.show_file_error = false;
          if (res.success) {
            this.lang_data.emit();
            window.location.reload();
          }
        })
      } else if (this.form_data.get('files')) {
        this._languageService.addLanguage(this.form_data).then(res => {
          this.form_data = new FormData;
          this.closeModal();
          this.show_file_error = false;
          if (res.success) {
            this.lang_data.emit();
            window.location.reload();
          }
        })
      } else {
        this.show_file_error = true;
      }
    }
  }

  ngOnDestroy(): void {
    this.admin_url = '';
    setTimeout(() => {
      this.languageForm.reset();
    }, 500);
  }

}
