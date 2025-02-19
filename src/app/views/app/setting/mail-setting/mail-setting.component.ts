import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { TemplateService } from 'src/app/services/template.service';
import { Helper } from 'src/app/shared/helper';
import * as Quill from 'quill';

@Component({
  selector: 'app-mail-setting',
  templateUrl: './mail-setting.component.html',
  styleUrls: ['./mail-setting.component.scss']
})
export class MailSettingComponent implements OnInit {
  selected_email = {
    emailAdminInfo: "",
    emailContent: "",
    emailTitle: "",
    emailUniqueId: "",
    emailUniqueTitle: "",
    _id: null
  }
  editor: any;
  selected :any ;
  emailType : any ;
  email_list: any = [];
  subadmin_readonly:boolean = false;

  @ViewChild('editorElementRef', { static: false }) editorElementRef: ElementRef;

  constructor(private _templateService: TemplateService, private config: NgSelectConfig, public _helper: Helper) {
    this.config.notFoundText = this._helper.trans.instant('label-title.no-data-found');
  }

  ngAfterViewInit() {
    this.editor = new Quill.default(this.editorElementRef.nativeElement, {
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],

          [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'script': 'sub' }, { 'script': 'super' }],     // superscript/subscript
          [{ 'indent': '-1' }, { 'indent': '+1' }],         // outdent/indent
          [{ 'direction': 'rtl' }],                         // text direction

          [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

          [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          [{ 'font': [] }],
          [{ 'align': [] }],                                // remove formatting button

          ['link', 'image', 'video']                        // link and image, video
        ]
      },
      theme: 'snow',
      sanitize: true
    });
  }

  ngOnInit(): void {
    //get email title list
    this._templateService.getEmailTitle().then(res => {
      if (res.success) {
        this.email_list = res.email_title;
        this.selected = this.email_list[0].emailUniqueTitle ;
        this.emailType = this.email_list[0];
        if(this.emailType){
          this.onSelectMail(this.emailType)
        }
      }
    })
    setTimeout(() => {
      if(!this._helper.has_permission(this._helper.PERMISSION.EDIT)){
        this.subadmin_readonly = true;
        this.editor.disable();
      }else{
        this.editor.enable();
      }
    }, 200);
  }

  //get email information on select email title
  onSelectMail(event) {
    if(event){
      this.emailType = event ;
      let json: any = { email_id: event._id }
      this._templateService.emailDetails(json).then(res => {
        if (res.success) {
          
          this.selected_email = res.email_title;
          this.editor.pasteHTML(this.selected_email.emailContent);
        }
      })
    }else{
      this.selected_email = {
        emailAdminInfo: "",
        emailContent: "",
        emailTitle: "",
        emailUniqueId: "",
        emailUniqueTitle: "",
        _id: null
      }
      this.editor.pasteHTML(this.selected_email.emailContent);
    }
  }

  //update data
  save(){
    this.selected_email.emailContent = this.editor.root.innerHTML;
    if(this.selected_email._id){
      let json:any = {
        email_id:this.selected_email._id,
        emailUniqueTitle:this.selected_email.emailUniqueTitle,
        emailTitle:this.selected_email.emailTitle,
        emailAdminInfo:this.selected_email.emailAdminInfo,
        emailContent:this.selected_email.emailContent,
      }
      this._templateService.updateEmailDetails(json)
    }
  }
}
