import { Routes } from '@angular/router';
import {MainLayout} from './pages/main.layout';
import {unauthenticatedRouteGuard} from './auth/route-guards/unauthenticated.route-guard';

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
        loadChildren: () => import('./pages/films/routes').then(r => r.FILMS_ROUTES)
      },
      {
        path: 'login',
        canActivate: [unauthenticatedRouteGuard],
        loadChildren: () => import('./pages/login/routes').then(r => r.LOGIN_ROUTES)
      }
    ]
  }
];
