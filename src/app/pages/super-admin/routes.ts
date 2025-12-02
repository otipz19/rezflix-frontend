import {Routes} from '@angular/router';
import {hasRoleRouteGuard} from '../../core/auth/route-guards/has-role-route.guard';
import {UserRoleDto} from '../../api';
import {SuperAdminPage} from './page/super-admin.page';

export const SUPER_ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: SuperAdminPage,
    canActivate: [hasRoleRouteGuard(UserRoleDto.SUPER_ADMIN)]
  }
];
