import { Injectable } from '@angular/core';
import { apiColletions } from "../constants/api_collection";
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class CarRentServiceService {

    constructor(private _api: ApiService) { }

    async getRentCarTypeList(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.fetch_car_rent_type, parameters })
            if (response.success) {
                return response.data;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    async addRentCarType(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.add_edit_car_rent_type, parameters })
            if (response.success) {
                return response.data;
            } else {
                return null;
            }
        } catch (err) {
            return null;
        }
    }

    async addEditRentCarModelBrand(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.add_edit_car_rent_brand_model, parameters })
            if (response.success) {
                return response.data;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    async getRentCarTypeBrandModel(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.fetch_car_rent_brand_model, parameters })
            if (response.success) {
                return response.data;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    async addEditRentCarFeature(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.add_edit_car_rent_feature, parameters })
            if (response.success) {
                return response.data;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    async carRentFeatureList(data): Promise<any> {
        try {
            let params = new HttpParams();
            params = params.append('page', data.page_no);
            params = params.append('limit', data.item_per_page);
            if (data.search_value && data.search_value != '') {
                params = params.append('search_value', data.search_value);
            }
            const response = await this._api.getwithparams({ url: apiColletions.fetch_car_rent_feature, params })
            if (response.success) {
                return response.data;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    async addEditRentCarSpecification(parameters): Promise<any> {
        try {
            const response = await this._api.post({ url: apiColletions.add_edit_car_rent_spedification, parameters })
            if (response.success) {
                return response.data;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    async carRentSpecificationList(data): Promise<any> {
        try {
            let params = new HttpParams();
            params = params.append('page', data.page_no);
            params = params.append('limit', data.item_per_page);
            if (data.search_value && data.search_value != '') {
                params = params.append('search_value', data.search_value);
            }
            const response = await this._api.getwithparams({ url: apiColletions.fetch_car_rent_specification, params })
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
