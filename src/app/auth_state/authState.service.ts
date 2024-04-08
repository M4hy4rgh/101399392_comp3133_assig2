import { state } from '@angular/animations';
import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { BrowserStorageServiceService } from '../browser-storage/BrowserStorageService.service';
@Injectable({
    providedIn: 'root',
})
export class AuthStateService {
    constructor(private router: Router, private storage: BrowserStorageServiceService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (typeof this.storage !== 'undefined') {
            const token = this.storage.getItem('token');
            const expiration = this.storage.getItem('token_expiration');
            const path = route.routeConfig?.path || '';

            if (token && expiration && new Date(expiration) > new Date()){
                if (['login', 'register', ''].includes(path)) {
                    this.router.navigate(['/employee-list']);
                    return false;
                }
                return true;
            } else {
                if (['login', 'register'].includes(path)) {
                    this.storage.removeItem('token');
                    this.storage.removeItem('token_expiration');
                    return true;
                } else {
                    this.storage.removeItem('token');
                    this.storage.removeItem('token_expiration');
                    this.router.navigate(['/login']);
                    return false;
                }
            }
        } else {
            console.error('localStorage is not available');
            return false;
        }
    }
}