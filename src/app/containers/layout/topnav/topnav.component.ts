import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SidebarService, ISidebar } from '../sidebar/sidebar.service';
import { LangService, Language } from 'src/app/shared/lang.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { getThemeColor, setThemeColor } from 'src/app/utils/util';
import { Helper } from 'src/app/shared/helper';
import { SettingsService } from 'src/app/services/settings.service';
import { CommonService } from 'src/app/services/common.service';
import { SocketService } from 'src/app/services/sockert.service';
import { ADMIN_NOTIFICATION_STRING, REDIRECT_NOTIFICATION_ROUTE } from 'src/app/constants/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
})
export class TopnavComponent implements OnInit, OnDestroy {
  darkTheme = localStorage.getItem('vien-themecolor')
  logoClr: boolean = false;
  IMAGE_URL = environment.IMAGE_URL;
  adminRoot = environment.adminRoot;
  sidebar: ISidebar;
  subscription: Subscription;
  displayName = 'Jaydeep Chandrapal';
  languages: Language[];
  currentLanguage: string;
  isSingleLang;
  isFullScreen = false;
  isDarkModeActive = false;
  searchKey = '';
  timezone_for_display_date: string = '';
  notifications: any[] = [];
  page = 1;
  pageSize = 5;
  isLoading = false;
  new_notifications_count: number;
  ADMIN_NOTIFICATION_STRING = ADMIN_NOTIFICATION_STRING;
  REDIRECT_NOTIFICATION_ROUTE = REDIRECT_NOTIFICATION_ROUTE;
  search_Query: string
  matched_Queries: any[]
  showSearchbar: boolean = false
  showList: boolean = false

  @ViewChild('scrollContainerElement', { static: false }) scrollContainerRef: ElementRef;

  constructor(private sidebarService: SidebarService, private authService: AuthService, public helper: Helper, private langService: LangService, private _settingService: SettingsService, private _commonService: CommonService, private _socket: SocketService, private _router: Router) {
    this.isDarkModeActive = getThemeColor().indexOf('dark') > -1;
  }

  onDarkModeChange(event): void {
    let color = getThemeColor();
    if (color.indexOf('dark') > -1) {
      color = color.replace('dark', 'light');
    } else if (color.indexOf('light') > -1) {
      color = color.replace('light', 'dark');
    }
    setThemeColor(color);
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }

  fullScreenClick(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }

  @HostListener('document:fullscreenchange', ['$event'])
  handleFullscreen(event): void {
    if (document.fullscreenElement) {
      this.isFullScreen = true;
    } else {
      this.isFullScreen = false;
    }
  }

  onLanguageChange(lang): void {
    this.langService.language = lang.code;
    this.currentLanguage = this.langService.languageShorthand;
    window.location.reload();
  }

  async ngOnInit(): Promise<void> {
    this.helper.display_date_timezone.subscribe(data => {
      this.timezone_for_display_date = data;
    })

    setTimeout(() => {
      this.languages = this.langService.supportedLanguages;
      this.currentLanguage = this.langService.languageShorthand;
      this.isSingleLang = this.langService.isSingleLang;
    }, 500);
    if (this.darkTheme.startsWith('dark')) {
      this.logoClr = true;
    }

    this.subscription = this.sidebarService.getSidebar().subscribe({
      next: (res: ISidebar) => {
        this.sidebar = res;
      },
      error: (err: any) => {
        console.error(`An error occurred: ${err.message}`);
      }
    });

    if (this.helper.user_details) {
      let json: any = { admin_id: this.helper.user_details._id };
      this._settingService.getSettingDetails(json).then((response) => {
        if (response.success && response.setting_detail) {
          this.helper.timeZone.next(response.setting_detail[0].timezone_for_display_date);
          this.helper.created_at.next(response.setting_detail[0].created_at);
          this.helper.decimal.next(response.setting_detail[0].decimal_point_value);
          this.helper.admin_settings.next(response.setting_detail[0]);
        }
      })
    }

    // Load the initial notifications
    this.loadNotifications(false);
    this.notificationSocket();
  }

  ngOnDestroy(): void {
    this._socket.disconnetRoom("admin_panel");
    this.subscription.unsubscribe();
  }

  menuButtonClick = (
    e: { stopPropagation: () => void },
    menuClickCount: number,
    containerClassnames: string
  ) => {
    if (e) {
      e.stopPropagation();
    }

    setTimeout(() => {
      const event = new Event('resize');
      window.dispatchEvent(event);
    }, 350);

    this.sidebarService.setContainerClassnames(
      ++menuClickCount,
      containerClassnames,
      this.sidebar.selectedMenuHasSubItems
    );
  }

  mobileMenuButtonClick = (
    event: { stopPropagation: () => void },
    containerClassnames: string
  ) => {
    if (event) {
      event.stopPropagation();
    }
    this.sidebarService.clickOnMobileMenu(containerClassnames);
  }

  onSignOut(): void {
    let json: any = { admin_id: this.helper.user_details._id }
    this.authService.logout(json);
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event): void {
    const input = document.querySelector('.mobile-view');
    if (input?.classList) {
      this.showSearchbar = false
      input.classList.remove('mobile-view');
    }
    this.searchKey = '';
    this.showList = false
  }

  notificationSocket() {
    this._socket.connectRoom("admin_panel");

    this._socket.listener("new_admin_notification").subscribe((response: any) => {
      this.new_notifications_count = response.new_notifications;
    })
  }

  loadNotifications(get_notification_list: boolean, from_scroll: boolean = false): void {
    if (!from_scroll) {
      this.notifications = [];
      this.page = 1;
    }

    // Avoid loading more data if already loading or if all notifications are loaded
    if (this.isLoading || (this.notifications.length > 0 && this.notifications.length % this.pageSize !== 0)) {
      return;
    }
    this.isLoading = true;
    this._commonService.getAdminNotifications({ get_notification_list: get_notification_list, page: this.page, is_main_admin: this.helper.is_main_admin, permissions: this.helper.permissions }).then((res: any) => {
      if (res.success) {
        this.isLoading = false;
        this.new_notifications_count = res.new_notifications;
        if (get_notification_list) {
          this.notifications.push(...res.admin_notifications);
          this.page++;
        }
      }
    })
    setTimeout(() => {
      if (this.scrollContainerRef) {
        this.scrollContainerRef.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
      }
    }, 100);
  }

  onScroll(): void {
    // Calculate the distance from the bottom of the scrollable element
    const scrollContainer = this.scrollContainerRef.nativeElement;
    const distanceFromBottom = scrollContainer.scrollHeight - (scrollContainer.scrollTop + scrollContainer.clientHeight);

    if (distanceFromBottom < 10) {
      this.loadNotifications(true, true);
    }
  }

  async notification_detail(notification): Promise<void> {
    await this.helper._route.navigateByUrl(REDIRECT_NOTIFICATION_ROUTE[notification.type])
    await this.helper.set_notification_detail(notification);
    this._commonService.removeNotifications({ notification_id: notification._id }).then((res: any) => {
      if (res.success) {
        this.isLoading = false;
      }
    })
  }

  matchSearchValues() {
    if (this.search_Query && this.search_Query != '') {
      this.search_Query = this.search_Query?.trim()
      const query = this.search_Query.toLowerCase();
      this.matched_Queries = this.langService.search_terms.filter(item => {
        const key = Object.keys(item)[0].toLowerCase();
        return key.includes(query);
      });
      this.showList = this.matched_Queries.length > 0
      this.showSearchbar = true
    } else {
      this.showSearchbar = false
      this.matched_Queries = []
      this.showList = this.matched_Queries.length > 0
    }
  }

  onDivFocus() {

    this.search_Query = (this.search_Query)?.trim();
    if(!this.search_Query || this.search_Query == ''){
      return 
    }

    if (!this.showSearchbar) {
      if (this.search_Query == '') {
        this.matched_Queries = [];
      } else {
        this.matchSearchValues()
      }
    } else {
      this.search_Query = ''
      this.matched_Queries = []
    }
    this.showList = this.matched_Queries.length > 0
    if (!this.search_Query) {
      this.showSearchbar = !this.showSearchbar
    }
  }

  getObjectKey(item: any): string {
    return item ? Object.keys(item)[0] : '';
  }

  navigateToSearch(route: Object) {
    let url = `${Object.values(route)[0]}`
    this._router.navigate([url])
  }

}
