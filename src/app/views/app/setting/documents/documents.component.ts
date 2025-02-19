import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { DocumentService } from 'src/app/services/document.service';
import { Helper } from 'src/app/shared/helper';
import { CountryService } from 'src/app/services/country.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  documentForm: UntypedFormGroup;
  document_search: any = '';
  document: any;
  selectedDocument: any;
  selectedCountry: any = { name: 'label-title.all', id: '' };
  UserOptions = [
    { name: 'label-title.user', type: 0, checked: false },
    { name: 'label-title.driver', type: 1, checked: false },
    { name: 'label-title.driver_vehicle', type: 2, checked: false }
  ];
  documents_list: any[] = [];
  filtered_document: any[] = [];
  country_list: any[] = [];
  countryOptions: any[] = [];
  is_edit: boolean = false;
  manualTrigger: boolean = false;
  is_add: boolean = false;
  isCollapsedAnimated: boolean = true;
  is_clear_disabled:boolean = true;
  country : any = 1;

  constructor(private _documentService: DocumentService, public _helper: Helper, private _countryService: CountryService) { }

  ngOnInit(): void {
    this._initForm();
    this.fetchDocument();

    //get country list
    this._countryService.fetchCountry().then(res => {
      this.country_list = res.country_list;
      
      res.country_list.forEach(country => {
        this.countryOptions.push({ name: country.countryname, id: country._id })
      });
    })
  }

  _initForm() {
    this.documentForm = new UntypedFormGroup({
      name: new UntypedFormControl(null, [Validators.required]),
      country: new UntypedFormControl(null, [Validators.required]),
      documentFor: new UntypedFormControl(0, [Validators.required]),
      is_mandatory: new UntypedFormControl(false, [Validators.required]),
      option: new UntypedFormControl(0, [Validators.required]),
      is_expiry: new UntypedFormControl(false, [Validators.required]),
      is_unique: new UntypedFormControl(false, [Validators.required]),
      is_document_visible: new UntypedFormControl(false, [Validators.required]),
    });
  }

  //get document list
  fetchDocument() {
    this._documentService.getDocumentList().then(res => {
      if (res.success) {
        this.documents_list = res.document_list;
        this.documents_list.forEach(doc => {
          doc.open = false
          doc.edit = true
        });
        this.filtered_document = this.documents_list;
      } else {
        this.filtered_document = [];
      }
    })
  }

  //open add modal
  onAdd(): void {
    this.is_add = true;
  }

  //open edit modal
  edit(document): void {
    document.edit = !document.edit
    this.is_edit = true
    this.document = document
    this.selectedDocument = document._id;
  }

  //add document
  onSubmit() {
    this.documentForm.patchValue({
      name: this.documentForm.value.name?.toString().trim(),
    })
    if(this.documentForm.invalid){
      this.documentForm.markAllAsTouched();
      return;
    }
    if (this.documentForm.valid) {
      if (this.documentForm.value.is_mandatory) {
        this.documentForm.patchValue({
          option: 1
        })
      } else {
        this.documentForm.patchValue({
          option: 0
        })
      }
      let json: any = {
        country: this.documentForm.value.country,
        title: this.documentForm.value.name,
        type: this.documentForm.value.documentFor,
        option: this.documentForm.value.option,
        is_unique_code: this.documentForm.value.is_unique,
        is_expired_date: this.documentForm.value.is_expiry,
        is_visible: this.documentForm.getRawValue().is_document_visible//when disable control its value becomes undefined so use getRawValue
      }
      this.is_add = false;

      this._documentService.addDocument(json).then((res) => {
        if (res.success) {
          this.ngOnInit()
        }
      })
    }
  }

  //update documnet
  onUpdate() {
    this.document.title = this.document.title?.toString().trim();
    if(!this.document.title){
      return;
    }
    let json: any = {
      document_id: this.selectedDocument,
      country: this.document.countryid,
      title: this.document.title,
      type: this.document.type,
      option: this.document.option,
      is_unique_code: this.document.is_unique_code,
      is_expired_date: this.document.is_expired_date,
      is_visible: this.document.is_visible

    }
    this._documentService.updateDocument(json).then(res => {
      if (res.success) {
        this.is_edit = false;
        this.selectedCountry = { name: this._helper.trans.instant('label-title.all'), id: '' };
        this.UserOptions.forEach(user => {
          if(user.checked){
            user.checked = !user.checked;
          }
        })
        this.document_search = '';
        this.fetchDocument();
      }
    })
  }

  //when change country in dropdown
  onChangeOrderBy(item) {
    this.is_clear_disabled = false;
    if (item != 1) {
      this.selectedCountry = { name: item.countryname, id: item._id };
    } else {
      this.selectedCountry = { name: this._helper.trans.instant('label-title.all'), id: '' };
    }
    this.onFilter();
  }

  //when check or uncheck usertype dropdown item
  onUserType(filter) {
    this.is_clear_disabled = false;
    filter.checked = !filter.checked
    this.onFilter();
  }

  //filter data
  onFilter() {
    this.filtered_document = this.documents_list;
    if (this.selectedCountry.id != "") {
      this.filtered_document = this.filtered_document.filter(x => x.countryid === this.selectedCountry.id)
    }
    let data: any = [];
    let index = this.UserOptions.findIndex(x => x.checked === true);
    if (index >= 0) {
      this.UserOptions.forEach(user => {
        if (user.checked) {
          this.filtered_document.forEach(document => {
            if (document.type === user.type) {
              data.push(document)
            }
          })
        }
      })
    } else {
      data = this.filtered_document;
    }
    this.filtered_document = data;
  }

  clear(){
    this.selectedCountry = { name: this._helper.trans.instant('label-title.all'), id: '' };
    this.UserOptions.forEach(user => {
      if(user.checked){
        user.checked = !user.checked;
      }
    })
    this.document_search = '';
    this.fetchDocument();
    this.is_clear_disabled = true;
    this.country = 1;
  }

  removeAddDocument(){
    this.is_add = false;
    this.documentForm.reset();
  }

  onChangeAddDocumentMandatory(){
    if(this.documentForm.value.is_mandatory){
      this.documentForm.patchValue({
        is_document_visible : true
      })
      this.documentForm.get('is_document_visible').disable();
    }else{
      this.documentForm.get('is_document_visible').enable();
    }
  }

  onChangeEditDocumentMandatory(document){
    if(document.option == 1 || document.option === true){
      document.is_visible = true;
    }
  }

}
