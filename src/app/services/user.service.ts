import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { apiColletions } from "../constants/api_collection";
import { ApiService } from "./api.service";

export enum user_page_type {
    "blocked", "approved"
}

@Injectable({
    providedIn: 'root'
})
export class UserService {

    public _userChanges = new BehaviorSubject<any>(null);
    _userObservable = this._userChanges.asObservable()

    constructor(private _api: ApiService) { }

    async fetchDocumentList(parameters) {
        try {
            const response = await this._api.post({ url: apiColletions.fetch_document_list, parameters })
            if (response.success) {
                return response.data;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    async getUserRefrralHistory(parameters) {
        try {
            const response = await this._api.post({ url: apiColletions.fetch_referral_list, parameters })
            if (response.success) {
                return response.data;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    async userApprove(parameters) {
        try {
            const response = await this._api.post({ url: apiColletions.type_is_approved, parameters })
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

    //rent car services
    async getRentVehicleList(parameters) {
        try {
            const response = await this._api.post({ url: apiColletions.admin_get_rent_vehicle_list, parameters })
            if (response.success) {
                return response.data;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    async getRentVehicleDetail(parameters) {
        try {
            const response = await this._api.post({ url: apiColletions.admin_get_rent_vehicle_detail, parameters })
            if (response.success) {
                return response.data;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    async approvedRejectVehicleDetail(parameters) {
        try {
            const response = await this._api.post({ url: apiColletions.admin_approve_reject_rent_vehicle, parameters })
            if (response.success) {
                return response.data;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

}
