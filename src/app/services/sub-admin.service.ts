import { Injectable } from '@angular/core';
import { apiColletions } from "../constants/api_collection";
import { ApiService } from "./api.service";

@Injectable({
	providedIn: 'root'
})
export class SubAdminService {

	constructor(private _api: ApiService) { }

	async addNewAdmin(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.add_new_admin, parameters })
			if (response.success) {
				return response;
			} else {
				return null;
			}
		} catch (err) {
			return null;
		}
	}

	async updateAdminDetails(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.update_admin_details, parameters })
			if (response.success) {
				return response;
			} else {
				return null;
			}

		} catch (err) {
			return null;
		}
	}

	async deleteAdmin(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.delete_admin, parameters })
			if (response.success) {
				return response.data
			} else {
				return null;
			}
		} catch (err) {
			return null;
		}
	}

	async adminUrlList(): Promise<any> {
		try {
			const response = await this._api.get({ url: apiColletions.admin_url_list })
			if (response.success) {
				return response.data
			} else {
				return null
			}
		} catch (error) {
			return null;
		}
	}

	async adminList(): Promise<any> {
		try {
			const response = await this._api.get({ url: apiColletions.admin_list })
			if (response.success) {
				return response.data
			} else {
				return null
			}
		} catch (error) {
			return null;
		}
	}

}
