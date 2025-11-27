import { Routes } from '@angular/router';
import {MainLayout} from './pages/main.layout';

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
      }
    ]
  }
];
