import { Injectable } from '@angular/core';
import { apiColletions } from "../constants/api_collection";
import { ApiService } from "./api.service";

@Injectable({
    providedIn: 'root'
})
export class ServiceTypeService {

    constructor(private _api: ApiService) { }

    async typeList(): Promise<any> {
        try {
            const response = await this._api.get({ url: apiColletions.service_type_list })
            if (response.success) {
                return response.data;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    async fetchServiceTypeList(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.fetch_service_type, parameters })
            if (response.success) {
                return response.data;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    }

    async addServiceType(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.add_service_type, parameters })
            if (response.success) {
                return response.data;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    }

    async editServiceType(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.edit_service_type, parameters })
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
