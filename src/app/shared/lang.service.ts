import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { getThemeLang, setThemeLang } from 'src/app/utils/util';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Helper } from './helper';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from '../services/language.service';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class LangService {
  LANGUAGE_URL = environment.LANGUAGE_URL;

  isSingleLang = false;
  renderer: Renderer2;
  defaultLanguage = getThemeLang();
  supportedLanguages: Language[] = [];
  private languages = new BehaviorSubject<any>(null)
  languagesObservable = this.languages.asObservable();
  search_terms: any[] = [];

  constructor(
    private translate: TranslateService,
    private rendererFactory: RendererFactory2,
    private router: Router,
    private _helper: Helper,
    private http: HttpClient,
    private _languageService: LanguageService,
    private titleService:Title
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  configLanguages(){ 
    return new Promise((resolve,rejects)=>{
      this._languageService.getLanguageList().then(res_data=>{
        if(res_data.success){
          let obj = res_data.language_list.find(list => list.code == localStorage.getItem('theme_lang'));
          if(!obj){
            setThemeLang('en','ltr')
            this.set_panel_name();
            // window.location.reload()
          }
          res_data.language_list.forEach(_lang => {
            let lang_direction = _lang.is_lang_rtl === true ? 'rtl' : 'ltr'
            this.supportedLanguages.push({ code: _lang.code, direction: lang_direction, label: _lang.name, shorthand: _lang.code })
          });
          setTimeout(() => {
            this.languages.next({})
          })
          resolve(true);
        }else{
          this.supportedLanguages.push({ code: 'en', direction: 'ltr', label: 'English', shorthand: 'en' })
          this.languages.next({})
          resolve(true);
        }
      })
    })
  }

  init(): void {
    this.configLanguages().then(()=>{
      this.supportedLanguages.forEach(_lang=>{
        try{
          const randomQueryParam = `random=${Math.random()}`;
          const data_2 = `${this.LANGUAGE_URL}language/${_lang.code}.json?${randomQueryParam}`;
          this.http.get(data_2).subscribe((res: any) => {
            this.translate.setTranslation(_lang.code, res);
            this.set_panel_name();
            this._helper.language_is_loading = false;
            this.translate.get('Search').subscribe((searchData: any) => {
              this.search_terms = searchData;
            });
          });
        }catch(err){
          const data_2 = `${this.LANGUAGE_URL}language/en.json`
          this.http.get(data_2).subscribe((res:any) => {
            this.translate.setTranslation('en',res)
            this.set_panel_name();
            this._helper.language_is_loading = false;
          })

        }
      })
    })

    this.translate.setDefaultLang(this.defaultLanguage);
    this.translate.use(this.defaultLanguage);

      this.renderer.removeClass(document.body, 'ltr');
      this.renderer.removeClass(document.body, 'rtl');    
      
      if(this.translate.currentLang == 'ar'){
        this.renderer.addClass(document.body, 'rtl');
      }else{
        this.renderer.addClass(document.body, 'ltr');
      }
  }
  set_panel_name(){
    this.titleService.setTitle(this._helper.trans.instant('app-title.rydex-admin'))
  }

  checkForDirectionChange(): void {
    this.renderer.removeClass(document.body, 'ltr');
    this.renderer.removeClass(document.body, 'rtl');
    this.renderer.addClass(document.body, this.direction);
    this.renderer.setAttribute(document.documentElement,'direction',this.direction);
  }

  set language(lang: string) {
    
    let language = lang || getThemeLang();
    
    const isSupportedLanguage = this.supportedLanguages.map((item) => item.code).includes(language);
    if (!isSupportedLanguage) {
      language = this.defaultLanguage;
    }
    this.translate.use(language);
    this.checkForDirectionChange();
    setThemeLang(language,this.direction);
  }

  get language(): string {
    return this.translate.currentLang;
  }

  get languageShorthand(): string {
    let currentLang = this.supportedLanguages.find(item => item.code === this.translate.currentLang);
    this.set_panel_name()
    return currentLang ? currentLang.shorthand : 'en';
  }

  get direction(): string {
    let currentDirection = this.supportedLanguages.find(item => item.code === this.translate.currentLang);
    return currentDirection ? currentDirection.direction : 'ltr';
  }

  get languageLabel(): string {
    return this.supportedLanguages.find(item => item.code === this.translate.currentLang).label;
  }
  
  get selectedlanguageIndex():number {
    return this.supportedLanguages.findIndex(item => item.code === this.translate.currentLang);
  }
}

export class Language {
  code: string;
  direction: string;
  label: string;
  shorthand: string;
}
