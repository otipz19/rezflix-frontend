import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {UserRoleDto} from '../../../api';

export const hasRoleRouteGuard = (...allowedRoles: UserRoleDto[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    if(authService.isAuthenticated() && allowedRoles.includes(authService.role()!)) {
      return true;
    }
    const router = inject(Router);
    return router.navigate(['/', 'forbidden']);
  }
};
