import { Injectable } from '@angular/core';
import { ApiService } from '../services/api.service';
import { apiColletions } from '../constants/api_collection';
import { HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class VehicleService {

    constructor(private _api: ApiService) { }

    async getAdminVehicles(data) {
        try {
            let params = new HttpParams();
            params = params.append('page', data.page_no);
            params = params.append('limit', data.item_per_page);

            if (data.countryid) {
                params = params.append('countryid', data.countryid);
            }
            if (data.vehicle_type != undefined && data.vehicle_type != null) {
                params = params.append('vehicle_type', data.vehicle_type);
            }
            if (data.typeid) {
                params = params.append('typeid', data.typeid);
            }
            if (data.brand_id) {
                params = params.append('brand_id', data.brand_id);
            }
            if (data.model_id) {
                params = params.append('model_id', data.model_id);
            }
            if (data.plate_no) {
                params = params.append('plate_no', data.plate_no);
            }

            if (data.passing_year) {
                params = params.append('passing_year', data.passing_year);
            }

            const res = await this._api.getwithparams({ url: apiColletions.get_admin_vehicles, params })
            if (res.success) {
                return res.data
            } else {
                return true
            }
        } catch (error) {
            return false;
        }
    }

    async add_admin_vehicle(parameters) {
        try {
            const response = await this._api.post({ url: apiColletions.add_admin_vehicle, parameters })
            if (response.success) {
                return response.data;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    async fetch_vehicle_admin_types() {
        try {
            const response = await this._api.get({ url: apiColletions.fetch_vehicle_admin_types })
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
