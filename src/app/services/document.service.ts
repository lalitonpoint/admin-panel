import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { apiColletions } from '../constants/api_collection';

@Injectable({
	providedIn: 'root'
})
export class DocumentService {

	constructor(private _api: ApiService) { }

	async getDocumentList(): Promise<any> {
		try {
			const response = await this._api.get({ url: apiColletions.admin_get_document_list })
			if (response) {
				return response.data
			} else {
				return null
			}
		} catch (error) {
			return null;
		}
	}

	async addDocument(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.admin_add_document_details, parameters })
			if (response) {
				return response.data
			} else {
				return null
			}
		} catch (error) {
			return null;
		}

	}

	async updateDocument(parameters): Promise<any> {
		try {
			const response = await this._api.post({ url: apiColletions.admin_update_document_details, parameters })
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
