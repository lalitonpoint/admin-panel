import { Injectable } from '@angular/core';
import { apiColletions } from "../constants/api_collection";
import { ApiService } from "./api.service";

@Injectable({
	providedIn: 'root'
})
export class SettingsService {

	constructor(private _api: ApiService) { }

	async getSettingDetails(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.admin_get_setting_details, parameters })
			if (response) {
				return response.data
			} else {
				return null
			}
		} catch (error) {
			return null;
		}
	}

	async updateSettingDetails(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.admin_update_setting_details, parameters })
			if (response) {
				return response.data
			} else {
				return null
			}
		} catch (error) {
			return null;
		}
	}

	async uploadLogoImages(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.admin_upload_logo_images, parameters })
			if (response) {
				return response.data
			} else {
				return null
			}
		} catch (error) {
			return null;
		}
	}

	async uplodadUserPanelImages(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.uplodad_user_panel_images, parameters })
			if (response) {
				return response.data
			} else {
				return null
			}
		} catch (error) {
			return null;
		}
	}

	async getChangeLogs(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.get_change_logs, parameters })
			if (response) {
				return response.data
			} else {
				return null
			}
		} catch (error) {
			return null;
		}
	}

	async getAdminSettingDetails(): Promise<any> {
		try {
			const response = await this._api.get({ url: apiColletions.get_admin_setting_detail })
			if (response) {
				return response.data
			} else {
				return null
			}
		} catch (error) {
			return null;
		}

	}

	async whatsappLogout(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.whatsapp_logout, parameters })
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
