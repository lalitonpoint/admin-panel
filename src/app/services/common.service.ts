import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { apiColletions } from "../constants/api_collection";
import { ApiService } from "./api.service";
import { SettingsService } from './settings.service';
import { Helper } from '../shared/helper';

export enum user_page_type {
    "blocked", "approved"
}
@Injectable({
    providedIn: 'root'
})
export class CommonService {

    private API_URL = environment.API_URL;
    public _userChanges = new BehaviorSubject<any>(null);
    _userObservable = this._userChanges.asObservable()

    public _exportChanges = new BehaviorSubject<any>(null);
    __exportChangesObservable = this._exportChanges.asObservable()

    constructor(private _api: ApiService, private _http: HttpClient, private _settingsService: SettingsService, private _helper: Helper) { }

    async _initApp() {
        try {
            let response = await this._settingsService.getAdminSettingDetails()
            this._helper.google_key.next(response.setting_detail.admin_panel_google_key);
            this._helper.loadGoogleScript("https://maps.googleapis.com/maps/api/js?key=" + response.setting_detail.admin_panel_google_key + "&libraries=places,drawing,visualization");
            if (response.success && response.setting_detail.is_use_captcha && response.setting_detail.recaptcha_site_key_for_web) {
                this._helper.loadGoogleScript("https://www.google.com/recaptcha/api.js?render=" + response.setting_detail.recaptcha_site_key_for_web)
            }
            return true;
        } catch (err) {
            return err;
        }
    }

    async getCountryTimezone(): Promise<any> {
        try {
            const res = await this._api.get({ url: apiColletions.get_country_timezone })
            if (res.success) {
                return res.data;

            } else {
                return null
            }
        } catch (error) {
            return null;
        }
    }

    async getAdminTypeList(data): Promise<any> {
        try {
            let params = new HttpParams();
            params = params.append('type', data.type);
            params = params.append('page', data.page_no);
            params = params.append('limit', data.item_per_page);

            if (data.is_active) {
                params = params.append('is_active', data.is_active);
            }
            if (data.is_approved != undefined) {
                params = params.append('is_approved', data.is_approved);
            }
            if (data.search_value && data.search_item) {
                params = params.append('search_item', data.search_item);
                params = params.append('search_value', data.search_value);
            }
            if (data.partner_id) {
                params = params.append('partner_id', data.partner_id);
            }
            if (data.corporate_id) {
                params = params.append('corporate_id', data.corporate_id);
            }
            if (data.is_excel_sheet) {
                params = params.append('is_excel_sheet', data.is_excel_sheet);
                params = params.append('header', data.header);
            }

            if (data.start_date) {
                params = params.append('start_date', data.start_date);
            }

            if (data.end_date) {
                params = params.append('end_date', data.end_date);
            }
            if (data.driver_type) {

                params = params.append('driver_type', data.driver_type);
            }
            if (data.user_type) {
                params = params.append('user_type', data.user_type);
            }

            const res = await this._api.getwithparams({ url: apiColletions.admin_all_type_list, params })

            if (res.success) {
                return res.data
            } else {
                return true
            }
        } catch (error) {
            return false;
        }
    }

    async deleteAndUpadateItem(parameters): Promise<boolean> {
        try {
            const response = await this._api.post({ url: apiColletions.delete_type_details, parameters })
            if (response.success) {
                this._userChanges.next({})
                return response.data;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    async fetchUpdateData(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.fetch_type_details, parameters })
            if (response.success) {
                return response.data;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    async updateItemByType(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.update_type_details, parameters })
            if (response.success) {
                this._userChanges.next({})
                return response.data;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    async addWallet(parameters): Promise<any> {
        try {
            const res = await this._api.post({ url: apiColletions.add_wallet_amount, parameters })
            if (res.success) {
                this._userChanges.next({})
                return res.data
            } else {
                return true
            }
        } catch (error) {
            return false;
        }
    }

    // approve Driver
    async approveDriver(parameters): Promise<any> {
        try {
            const res = await this._api.post({ url: apiColletions.type_is_approved, parameters })
            if (res.success) {
                this._userChanges.next({})
                return res.data
            } else {
                return null
            }
        } catch (error) {
            return null;
        }
    }

    // approve Rntal Driver
    async approveRentalDriver(parameters): Promise<any> {
        try {
            const res = await this._api.post({ url: apiColletions.admin_approve_reject_rental_driver, parameters })
            if (res.success) {
                this._userChanges.next({})
                return res.data
            } else {
                return null
            }
        } catch (error) {
            return null;
        }
    }

    //dashboard details
    async dashboard_detail(parameters): Promise<any> {
        try {
            const res = await this._api.post({ url: apiColletions.dashboard_detail, parameters })
            if (res.success) {
                this._userChanges.next({})
                return res.data
            } else {
                return true
            }
        } catch (error) {
            return false;
        }
    }

    async getExportHistoryList(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.get_export_history_list, parameters })
            if (response.success) {
                return response.data;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    async deleteExportFile(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.delete_export_file, parameters })
            if (response.success) {
                this._exportChanges.next({})
                return response.data;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    async getAdminNotifications(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.get_admin_notifications, parameters })
            if (response.success) {
                this._exportChanges.next({})
                return response.data;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    async removeNotifications(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.remove_notification, parameters })
            if (response.success) {
                this._exportChanges.next({})
                return (response.data);
            } else {
                return (false);
            }
        } catch (err) {
            return (false);
        }
    }

    async getRentCarOwnerList(data): Promise<any> {
        try {
            let params = new HttpParams();
            params = params.append('page', data.page_no);
            params = params.append('limit', data.item_per_page);

            if (data.search_value && data.search_item) {
                params = params.append('search_item', data.search_item);
                params = params.append('search_value', data.search_value);
            }

            if (data.is_excel_sheet) {
                params = params.append('is_excel_sheet', data.is_excel_sheet);
                params = params.append('header', data.header);
            }

            if (data.start_date) {
                params = params.append('start_date', data.start_date);
            }

            if (data.end_date) {
                params = params.append('end_date', data.end_date);
            }

            const res = await this._api.getwithparams({ url: apiColletions.admin_rent_car_owner_list, params });

            if (res.success) {
                return res.data
            } else {
                return true
            }
        } catch (error) {
            return false;
        }
    }



}
