import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { apiColletions } from '../constants/api_collection';

@Injectable({
    providedIn: "root"
})

export class ManageVehicleService {
    constructor(private _api: ApiService) { }

    async getVehicleBrandModel(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.get_vehicle_brand_model, parameters })
            if (response.success) {
                return response.data;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    async getVehicleHistory(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.get_vehicle_history, parameters })
            if (response.success) {
                return response.data;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    async addEditVehicleModelBrand(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.add_edit_vehicle_model_brand, parameters })
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