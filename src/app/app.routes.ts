import { Routes } from '@angular/router';
import {MainLayout} from './pages/main.layout';
import {unauthenticatedRouteGuard} from './core/auth/route-guards/unauthenticated.route-guard';
import {FILMS_ROUTES} from './pages/films/routes';
import {SUPER_ADMIN_ROUTES} from './pages/super-admin/routes';
import {NotFoundPage} from './pages/not-found/page/not-found.page';
import {ForbiddenPage} from './pages/forbidden/page/forbidden.page';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'films'
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'films',
        children: FILMS_ROUTES
      },
      {
        path: 'super-admin',
        children: SUPER_ADMIN_ROUTES
      },
      {
        path: 'auth',
        canActivate: [unauthenticatedRouteGuard],
        loadChildren: () => import('./pages/auth/routes').then(r => r.AUTH_ROUTES)
      },
      {
        path: 'forbidden',
        component: ForbiddenPage
      },
      {
        path: '**',
        component: NotFoundPage
      }
    ]
  }
];
