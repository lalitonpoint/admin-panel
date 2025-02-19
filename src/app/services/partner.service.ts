import { ApiService } from './api.service';
import { Injectable } from '@angular/core';
import { apiColletions } from '../constants/api_collection'
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PartnerService {

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


    async updateDocument(parameters) {
        try {
            const response = await this._api.post({ url: apiColletions.update_document_details, parameters })
            if (response.success) {
                this._userChanges.next({})
                return response.data
            } else {
                return false;
            }

        } catch (err) {
            return false;
        }
    }

    async partnerVehicleUpdate(parameters) {
        try {
            const response = await this._api.post({ url: apiColletions.type_update_vehicle, parameters })
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
}
