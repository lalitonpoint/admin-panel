import { Injectable } from '@angular/core';
import { apiColletions } from "../constants/api_collection";
import { ApiService } from "./api.service";

@Injectable({
	providedIn: 'root'
})
export class PromoService {

	constructor(private _api: ApiService) { }

	async fetchPromoList(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.admin_fetch_promo_list, parameters })
			if (response) {
				return response.data
			} else {
				return null
			}
		} catch (error) {
			return null;
		}
	}

	async promoUsedInfo(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.admin_promo_used_info, parameters })
			if (response) {
				return response.data
			} else {
				return null
			}
		} catch (error) {
			return null;
		}
	}

	async addPromo(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.admin_add_promo, parameters })
			if (response) {
				return response.data
			} else {
				return null
			}
		} catch (error) {
			return null;
		}
	}

	async deletePromo(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.admin_delete_promocode, parameters })
			if (response) {
				return response.data
			} else {
				return null
			}
		} catch (error) {
			return null;
		}
	}

	async updatePromo(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.admin_update_promo_details, parameters })
			if (response) {
				return response.data
			} else {
				return null
			}
		} catch (error) {
			return null;
		}
	}

}
