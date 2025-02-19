import { Injectable } from '@angular/core';
import { apiColletions } from "../constants/api_collection";
import { ApiService } from "./api.service";

@Injectable({
	providedIn: 'root'
})
export class MassNotificationService {

	constructor(private _api: ApiService) { }

	async massNotificationList(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.fetch_notification_list, parameters })
			if (response.success) {
				return response.data;
			} else {
				return null;
			}
		} catch (err) {
			return null;
		}
	}

	async sendNotification(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.send_mass_notification, parameters })
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
