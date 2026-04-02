import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const expectedRoles = (route.data['roles'] as string[]) ?? [];
    const currentRole = this.authService.getRole();

    if (currentRole && expectedRoles.includes(currentRole)) {
      return true;
    }

    return this.router.createUrlTree([this.authService.getDashboardRoute()]);
  }
}
