import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { apiColletions } from "../constants/api_collection";
import { ApiService } from "./api.service";

@Injectable({
    providedIn: 'root'
})
export class TypeCityAssociationService {
    public _cityTypeChanges = new BehaviorSubject<any>(null);
    _cityTypeObservable = this._cityTypeChanges.asObservable()
    public _cityTypeSelect = new Subject<any>();
    public _addCityType = new Subject<any>();
    public _unselectCityType = new Subject<any>();

    constructor(private _api: ApiService) { }

    async getAllTypeCitylist(parameters): Promise<any> {
        try {
            const res = await this._api.post({ url: apiColletions.admin_fetch_service_price, parameters })
            if (res.success) {
                return (res.data)
            } else {
                return null
            }
        } catch (error) {
            return null;
        }
    }
    //add Type City
    async addTypeCity(parameters): Promise<any> {
        try {
            const res = await this._api.post({ url: apiColletions.add_service_price, parameters })
            if (res.success) {
                this._addCityType.next({});
                return res.data
            } else {
                return null
            }
        } catch (error) {
            return null;
        }
    }
    //update Type City
    async updateTypeCity(parameters): Promise<any> {
        try {
            const res = await this._api.post({ url: apiColletions.update_service_price, parameters })
            if (res.success) {
                if (parameters.service_type_id && parameters.type && !parameters.is_for_car_rent_service) {
                    this._cityTypeChanges.next(parameters.service_type_id)
                }
                return res.data
            } else {
                return null
            }
        } catch (error) {
            return null;
        }
    }
    //check zone
    async checkZone(parameters): Promise<any> {
        try {
            const res = await this._api.post({ url: apiColletions.check_zone_price_exist, parameters })
            if (res.success) {
                return true
            } else {
                return null
            }
        } catch (error) {
            return false;
        }
    }
    //city wise typelist api call
    async fetchTypelist(parameters): Promise<any> {
        try {
            const res = await this._api.post({ url: apiColletions.admin_fetch_unique_types, parameters })
            if (res.success) {
                return res.data
            } else {
                return null
            }
        } catch (error) {
            return null;
        }
    }
    //get apirport price
    async fetchAirportPrice(parameters): Promise<any> {
        try {
            const res = await this._api.post({ url: apiColletions.admin_fetch_airport_price, parameters })
            if (res.success) {
                return res.data
            } else {
                return null
            }
        } catch (error) {
            return null;
        }
    }
    //get zone price
    async fetchZonePrice(parameters): Promise<any> {
        try {
            const res = await this._api.post({ url: apiColletions.admin_fetch_zone_price, parameters })
            if (res.success) {
                return res.data
            } else {
                return null
            }
        } catch (error) {
            return null;
        }
    }
    //get city price
    async fetchCityPrice(parameters): Promise<any> {
        try {
            const res = await this._api.post({ url: apiColletions.admin_fetch_city_price, parameters })
            if (res.success) {
                return res.data
            } else {
                return null
            }
        } catch (error) {
            return null;
        }
    }
    //update surge hour
    async updateSurgeHour(parameters): Promise<any> {
        try {
            const res = await this._api.post({ url: apiColletions.update_surge_hour, parameters })
            if (res.success) {
                if (parameters.service_type_id) {
                    this._cityTypeChanges.next(parameters.service_type_id)
                }
                return res.data
            } else {
                return null
            }
        } catch (error) {
            return null;
        }
    }
    //get rental price
    async fetchRenatlPrice(parameters): Promise<any> {
        try {
            const res = await this._api.post({ url: apiColletions.admin_fetch_car_rental, parameters })
            if (res.success) {
                return res.data
            } else {
                return null
            }
        } catch (error) {
            return null;
        }
    }
    //update rental price
    async updateRenatlPrice(parameters): Promise<any> {
        try {
            const res = await this._api.post({ url: apiColletions.update_service_price, parameters })
            if (res.success) {
                return res.data
            } else {
                return null
            }
        } catch (error) {
            return null;
        }
    }
    //delete rental package
    async deleteRenatlPackage(parameters): Promise<any> {
        try {
            const res = await this._api.post({ url: apiColletions.update_service_price, parameters })
            if (res.success) {
                if (parameters.rich_surge_price) {
                    this._cityTypeChanges.next(parameters.service_type_id)
                }
                return res.data
            } else {
                return null
            }
        } catch (error) {
            return null;
        }
    }
    //get rich surge
    async fetchRichSurge(parameters): Promise<any> {
        try {
            const res = await this._api.post({ url: apiColletions.admin_fetch_rich_surge, parameters })
            if (res.success) {
                return res.data
            } else {
                return
            }
        } catch (error) {
            return;
        }
    }

    async addZoneQueue(parameters): Promise<any> {
        try {
            const res = await this._api.post({ url: apiColletions.add_zone_queue, parameters })
            if (res.success) {
                return res.data
            } else {
                return
            }
        } catch (error) {
            return;
        }
    }
}