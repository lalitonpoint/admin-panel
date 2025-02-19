import { Component, OnInit ,TemplateRef,ViewChild} from '@angular/core';
import { AddNewLanguageModalComponent } from 'src/app/containers/pages/add-new-language-modal/add-new-language-modal.component';
import { LanguageService } from "src/app/services/language.service";
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Helper } from 'src/app/shared/helper';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {
  IMAGE_URL = environment.IMAGE_URL
  data: any;
  language_list:any;
  selected_languge:any;
  confirmModelRef: BsModalRef;
  confirmationModalConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
  };

  @ViewChild('addNewModalRef', { static: true }) addNewModalRef: AddNewLanguageModalComponent;
  @ViewChild('confirmationTemplate', { static: true }) confirmationTemplate: TemplateRef<any>;

  constructor(public _helper:Helper,private _languageService:LanguageService,private http: HttpClient,private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getlanglist();
  }
  
  getlanglist(){
    this._languageService.getLanguageList().then(res => {
      if(res.success){
        this.language_list = res.language_list;
      }
    })
  }
  
  showAddNewModal(): void {
    this.addNewModalRef.show();
  }

  showEditModal(language): void {
    this.addNewModalRef.edit(language);
  }

  downLoadLang(lang){
    if (lang.code) {
      let code = lang.code 
      const data_2 = `${this.IMAGE_URL}language/${code}.json`
      this.http.get(data_2).subscribe((res:any) => {
        this.downloadJSON(JSON.stringify(res, null, 2), code)
      })
    }
  }

  async downloadJSON(data, fileName) {
    let blob = new Blob([data], { type: '2' });
    saveAs(blob, fileName + '.json')
  }

  deleteLang(lang){
    this.selected_languge = lang;
    this.confirmModelRef = this.modalService.show(this.confirmationTemplate, this.confirmationModalConfig);
  }

  confirm(){
    let json:any ={ id : this.selected_languge._id}
    this._languageService.deleteLanguage(json).then(res => {
      if(res.success){
        this.cancel();
        this.getlanglist();
      }
    })
  }

  cancel(){
    this.confirmModelRef.hide()
  }

}
