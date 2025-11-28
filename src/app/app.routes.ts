import { Routes } from '@angular/router';
import {MainLayout} from './pages/main.layout';
import {unauthenticatedRouteGuard} from './core/auth/route-guards/unauthenticated.route-guard';

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
        path: 'auth',
        canActivate: [unauthenticatedRouteGuard],
        loadChildren: () => import('./pages/auth/routes').then(r => r.AUTH_ROUTES)
      }
    ]
  }
];
