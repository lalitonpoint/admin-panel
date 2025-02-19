import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Helper } from '../shared/helper';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
    constructor(private authService: AuthService, private router: Router, private _helper: Helper) { }

    permissions: Array<any>;

    async canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        let check_permission = route.data['auth'];

        if (this.authService.logginUser) {
            if(this._helper.is_rental){
                this.authService.check_subscription().then((response)=>{
                    if(response){
                        if (!check_permission || this.authService.is_main_store_login) {
                            return true;
                        } else {
                            this.authService.authPermission.subscribe(permissions => {
                                this.permissions = permissions;
                                if (permissions?.length > 0) {
            
                                    if ((this.permissions && !this.permissions.some(bid => bid.url === check_permission))) {
                                        let route = '';
                                        for (const permissions of this.permissions) {
                                            if (permissions.route) {
                                                route = permissions.route;
                                                break;
                                            }
                                        }
                                        this.router.navigate([route])
                                    }
                                    return this.hasPermission(check_permission)
                                } else {
                                    return false
                                }
                            })
                        }
                    }else{
                      this._helper._route.navigateByUrl('/admin/check-subscription');
                    }
                })
            }else{
                if (!check_permission || this.authService.is_main_store_login) {
                    return true;
                } else {
                    this.authService.authPermission.subscribe(permissions => {
                        this.permissions = permissions;
                        if (permissions?.length > 0) {
    
                            if ((this.permissions && !this.permissions.some(bid => bid.url === check_permission))) {
                                let route = '';
                                for (const permissions of this.permissions) {
                                    if (permissions.route) {
                                        route = permissions.route;
                                        break;
                                    }
                                }
                                this.router.navigate([route])
                            }
                            return this.hasPermission(check_permission)
                        } else {
                            return false
                        }
                    })
                }
            }
        } else {
            return false
        }
    }

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        let check_permission = route.data['auth'];
        if (this.authService.logginUser) {
            if (!check_permission || this.authService.is_main_store_login) {
                return true;
            } else {
                return this.hasPermission(check_permission)
            }
        } else {
            return false
        }
    }



    async hasPermission(check_permission): Promise<boolean> {
        if (!this.permissions) {
            this.permissions = await this.authService.authPermission.toPromise();
        }

        return !!this.permissions?.some(bid => bid.url === check_permission);
    }

}
