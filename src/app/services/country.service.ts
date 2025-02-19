import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { apiColletions } from "../constants/api_collection";
import { ApiService } from "./api.service";

@Injectable({ providedIn: 'root' })
export class CountryService {
    public _countryChanges = new BehaviorSubject<any>(null);
    _countryObservable = this._countryChanges.asObservable()

    constructor(private _api: ApiService) { }

    async fetchCountry(): Promise<any> {
        try {
            const response = await this._api.get({ url: apiColletions.fetch_country_details })
            if (response.success) {
                return response.data;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    }

    async addCountry(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.add_country_details, parameters })
            if (response.success) {
                this._countryChanges.next(null)
                return response.data;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    }

    async updateCountry(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.update_country_details, parameters })
            if (response.success) {
                if (parameters.country_id) {
                    this._countryChanges.next(parameters.country_id)
                }
                return response.data;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    }

    async getAllCountry(): Promise<any> {
        try {
            const response = await this._api.get({ url: apiColletions.get_All_country_list })
            if (response.success) {
                return (response.data);
            } else {
                return (null);
            }
        } catch (err) {
            return (null);
        }
    }

    async getCountryData(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.check_country_exists, parameters })
            if (response.success) {
                return response.data;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    }

    async getCountryCode(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.get_country_code, parameters })
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
