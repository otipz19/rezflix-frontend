import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {UserRoleDto} from '../../../api';

export const anonymousOrViewerRouteGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  if(!authService.isAuthenticated() || authService.role() === UserRoleDto.VIEWER) {
    return true;
  }
  const router = inject(Router);
  return router.navigate(['/', 'forbidden']);
};
