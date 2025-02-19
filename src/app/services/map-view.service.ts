import { Injectable } from '@angular/core';
import { apiColletions } from "../constants/api_collection";
import { ApiService } from "./api.service";

@Injectable({
  providedIn: 'root'
})
export class MapViewService {

  constructor(private _api: ApiService) { }

  async providerList(parameters): Promise<any> {
    try {
      const response = await this._api.post({ url: apiColletions.provider_list_for_map, parameters })
      if (response.success) {
        return response.data;
      } else {
        return null
      }
    } catch (err) {
      return null
    }
  }

  async vehicleTypeList(parameters): Promise<any> {
    try {
      const response = await this._api.post({ url: apiColletions.fetch_vehicle_type_list, parameters })
      if (response.success) {
        return response.data;
      } else {
        return null;
      }
    } catch (err) {
        return null;
    }
  }

  async providerListFromCity(parameters): Promise<any> {
    try {
      const response = await this._api.post({ url: apiColletions.fetch_provider_list, parameters })
      if (response) {
        return response.data;
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }

  async getAllCities(): Promise<any> {
      try {
        const response = await this._api.post({ url: apiColletions.fetch_all_city, parameters:{} })
        if (response) {
          return response.data;
        } else {
          return null;
        }
      } catch (err) {
        return null;
      }
  }


  async getHeatMapData(parameters): Promise<any> {
      try {
        const response = await this._api.post({ url: apiColletions.fetch_heat_map, parameters})
        if (response) {
          return response.data;
        } else {
          return null;
        }
      } catch (err) {
        return null;
      }
  }

  async getHubList(parameters): Promise<any> {
      try {
        const response = await this._api.post({ url: apiColletions.get_hub_list, parameters})
        if (response) {
          return response.data;
        } else {
          return null;
        }
      } catch (err) {
        return null;
      }
  }

}
