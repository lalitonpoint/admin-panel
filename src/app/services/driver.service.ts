import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { apiColletions } from '../constants/api_collection';

export enum user_page_type {
    "blocked", "approved"
}
export enum user_active_type {
    "inactive", "active"
}

@Injectable({
    providedIn: 'root'
})
export class DriverService {

    constructor(private _api: ApiService) { }

    async providerUnfreeze(parameters) {
        try {
            const res = await this._api.post({ url: apiColletions.unfreeze_provider, parameters })
            if (res.success) {
                return res.data
            } else {
                return false
            }
        } catch (error) {
            return false;
        }
    }

    // add vehicle 
    async vehicle(parameters) {
        try {
            const res = await this._api.post({ url: apiColletions.add_provider_vehicle, parameters })
            if (res.success) {
                return res.data
            } else {
                return false
            }
        } catch (error) {
            return false;
        }
    }

    // add vehicle 
    async admin_add_provider(parameters) {
        try {
            const res = await this._api.post({ url: apiColletions.admin_add_provider, parameters })
            if (res.success) {
                return res.data
            } else {
                return false
            }
        } catch (error) {
            return false;
        }
    }

    async getZoneProviderList(parameters) {
        try {
            const res = await this._api.post({ url: apiColletions.get_zone_provider_list, parameters })
            if (res.success) {
                return res.data
            } else {
                return false
            }
        } catch (error) {
            return false;
        }
    }

    async checkWsalStatus(parameters) {
        try {
            const res = await this._api.post({ url: apiColletions.check_wsal_status, parameters })
            if (res.success) {
                return res.data
            } else {
                return false
            }
        } catch (error) {
            return false;
        }
    }


}
