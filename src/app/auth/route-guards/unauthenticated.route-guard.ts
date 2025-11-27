import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";

export const unauthenticatedRouteGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const isAuthenticated = authService.isAuthenticated();
  if(!isAuthenticated) {
    return true;
  }
  const router = inject(Router);
  return router.navigate(['/']);
};
