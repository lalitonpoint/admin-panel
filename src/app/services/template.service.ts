import { Injectable } from '@angular/core';
import { apiColletions } from "../constants/api_collection";
import { ApiService } from "./api.service";

@Injectable({
    providedIn: 'root'
})
export class TemplateService {

    constructor(private _api: ApiService) { }

    async getEmailTitle(): Promise<any> {
        try {
            const response = await this._api.get({ url: apiColletions.admin_get_email_title })
            if (response.success) {
                return response.data
            } else {
                return null
            }
        } catch (error) {
            return null
        }
    }

    async emailDetails(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.admin_fetch_email_detail, parameters })
            if (response.success) {
                return response.data;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    }

    async updateEmailDetails(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.update_email_detail, parameters })
            if (response.success) {
                return response.data;
            } else {
                return null
            }
        } catch (err) {
            return null;
        }
    }

    async getSmsDetails(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.fetch_sms_details, parameters: {} })
            if (response.success) {
                return response.data;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    }

    async updateSmsDetails(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.update_sms_details, parameters })
            if (response.success) {
                return response.data;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    }

}
