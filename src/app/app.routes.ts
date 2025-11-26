import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'films'
  },
  {
    path: 'films',
    loadChildren: () => import('./pages/films/routes').then(r => r.FILMS_ROUTES)
  }
];
