import { Injectable } from '@angular/core';
import { apiColletions } from "../constants/api_collection";
import { ApiService } from "./api.service";

@Injectable({
    providedIn: 'root'
})
export class LanguageService {

    constructor(private _api: ApiService) { }

    async getLanguageList(): Promise<any> {
        try {
            const response = await this._api.get({ url: apiColletions.get_language_list })
            if (response.success) {
                return response.data
            } else {
                return null
            }
        } catch (error) {
            return null
        }
    }

    async addLanguage(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.add_new_language, parameters })
            if (response.success) {
                return response;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    }

    async editLanguage(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.edit_language, parameters })
            if (response.success) {
                return response;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }

    }

    async deleteLanguage(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.delete_language, parameters })
            if (response.success) {
                return response;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    }

}
