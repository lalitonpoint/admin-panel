import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { apiColletions } from "../constants/api_collection";
import { UserModel } from "../models/user.model";
import { Helper } from "../shared/helper";
import { ApiService } from "./api.service";
import { getUserRole } from 'src/app/utils/util';
import { EncryptionDecryptionService } from "./encrypt-decrypt.service";

@Injectable({ providedIn: 'root' })
export class AuthService {

    public logginUser: any;
    public user_details:any;
    public loginSubject = new BehaviorSubject<any>(null);
    loginObservable: Observable<UserModel> = this.loginSubject.asObservable();
    private permissions = new BehaviorSubject<any>(null);
    authPermission = this.permissions.asObservable();
    is_main_store_login;


    get isAuthenticated(): boolean {
        return !this.logginUser || this.logginUser === null;
    }

    get user_detail() {
        return this.logginUser ? this.logginUser : new UserModel();
    }

    constructor(private _api: ApiService, private helper: Helper,private _encryptionDecryptionService:EncryptionDecryptionService) {
        if(localStorage.getItem('userData')){
            this._encryptionDecryptionService.decryptData(localStorage.getItem('userData')).then((response) => {
                this.user_details = response;
            })
        }
    }

    //generate recaotcha token
    async generateRecaptchaToken(): Promise<any> {
        try {
            const response = await this._api.get({ url: apiColletions.get_admin_setting_detail })
            if (response.success) {
                const is_use_captcha = response.data.setting_detail.is_use_captcha;
                if (is_use_captcha) {
                    return await new Promise((resolve, reject) => {
                        grecaptcha.ready(() => {
                            const recaptcha_site_key = response.data.setting_detail.recaptcha_site_key_for_web;
                            grecaptcha.execute(recaptcha_site_key, { action: 'submit' }).then((token) => {
                                resolve(token)
                            })
                        });
                    });
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    // Login
    async login(parameters): Promise<boolean> {
        try {
            const captcha_token = await this.generateRecaptchaToken();
            if (captcha_token) {
                parameters['captcha_token'] = captcha_token;
            }
            const response = await this._api.post({ url: apiColletions.login, parameters })
            if (response.success) {
                this.logginUser = response.data.adminDetail;
                let localStorageData = {
                    _id: this.logginUser._id,
                    username: this.logginUser.username,
                    token: this.logginUser.token,
                    country: this.logginUser.country,
                    email: this.logginUser.email,
                    is_rental: response.data.is_rental
                    // url_array: this.logginUser.url_array
                }
                this.helper.is_rental = response.data.is_rental;
                if (response.data.adminDetail.type === 1) {
                    this.helper.user_details = localStorageData;
                    this.subStoreSignIn(response.data.adminDetail.url_array)
                    this.is_main_store_login = false;
                    this.helper.is_main_admin = false;
                } else {
                    this.helper.is_main_admin = true;
                    this.is_main_store_login = true;
                    this.helper.user_details = localStorageData;
                    const encryptedDta = await this._encryptionDecryptionService.encryptData(localStorageData);
                    localStorage.setItem('userData', encryptedDta)
                    localStorage.setItem('newEncryptUserData', encryptedDta);
                    this.loginSubject.next(this.logginUser);
                }
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return true;
        }
    }

  async check_subscription() {
    try {
      const parameters: any = {};
      const response = await this._api.post({ url: apiColletions.check_subscription, parameters });

      if (response.success) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  async create_subscription_session(parameters) {
    try {
      const response = await this._api.post({ url: apiColletions.create_subscription_session, parameters });

      if (response.success) {
        return response;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }


    async logout(parameters): Promise<boolean> {
        try {
            const response = await this._api.post({ url: apiColletions.logout, parameters })
            if (response.success) {
                this.logginUser = null;
                this.loginSubject.next(this.logginUser);
                localStorage.removeItem('userData');
                localStorage.removeItem('newEncryptUserData');
                localStorage.removeItem('adminPermissions');
                this.permissions.next(null)
                this.helper.permissions = [];
                this.helper.is_main_admin = true;
                this.helper.isUpadtedlocalStorage();
                this.helper._route.navigate(['/admin/login'])
                return true
            } else {
                return false
            }
        } catch (error) {
            return false;
        }
    }

    // Forgot Password

    async forgot_password_Email(parameters): Promise<boolean> {
        try {
            const captcha_token = await this.generateRecaptchaToken();
            if (captcha_token) {
                parameters['captcha_token'] = captcha_token;
            }
            const response = await this._api.post({ url: apiColletions.forgot_password, parameters })
            if (response.success) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }

    async new_password(parameters): Promise<boolean> {
        try {
            let response = await this._api.post({ url: apiColletions.new_password, parameters })
            if (response.success) {
                return (true);
            } else {
                return (false);
            }
        } catch (err) {
            return (false);
        }
    }

    async autologin() {
        if(localStorage.getItem('userData')){
            this.logginUser = await this._encryptionDecryptionService.decryptData(localStorage.getItem('userData'))
        }
        if (this.logginUser?.token) {
            let parameters = {}
            const response = await this._api.post({ url: apiColletions.get_permissions, parameters })
            if (response.success) {
                if (response.data.type == 1) {
                    let adminPermissions = response.data.url_array;
                    localStorage.setItem('adminPermissions', JSON.stringify(adminPermissions))
                    this.is_main_store_login = false;
                    this.helper.is_main_admin = false;
                } else {
                    this.helper.is_main_admin = true;
                    this.is_main_store_login = true;
                }
                this.helper.is_rental = response.data.is_rental;
            }
            let adminPermissions = JSON.parse(localStorage.getItem('adminPermissions'));
            if (adminPermissions) {
                this.is_main_store_login = false;
                this.permissions.next(adminPermissions)
                this.helper.permissions = adminPermissions;
                this.helper.is_main_admin = false;
            } else {
                this.permissions.next(null)
                this.helper.permissions = [];
                this.helper.is_main_admin = true;
                this.is_main_store_login = true;
            }
            this.loginSubject.next(this.logginUser);
        } else {
            this.logginUser = null;
            this.loginSubject.next(this.logginUser);
            localStorage.removeItem('userData');
            localStorage.removeItem('newEncryptUserData');
            localStorage.removeItem('adminPermissions');
            this.helper.isUpadtedlocalStorage();
            let current_route = `${window.location}`;
            if (!current_route.includes('/reset-password')) {
                this.helper._route.navigate(['/admin/login'])
            }
        }
    }

    async subStoreSignIn(urls) {
        const permissions = urls;
        this.permissions.next(permissions)
        this.helper.permissions = permissions;

        this.is_main_store_login = false;
        const encryptedDta = await this._encryptionDecryptionService.encryptData(this.logginUser);
        localStorage.setItem('userData', encryptedDta);
        localStorage.setItem('newEncryptUserData', encryptedDta);
        localStorage.setItem('adminPermissions', JSON.stringify(permissions));
        this.loginSubject.next(this.logginUser);
    }

    async getUser() {
        return { displayName: this.logginUser.username, role: getUserRole() };
    }

}
