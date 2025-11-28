import {Routes} from '@angular/router';
import {FilmsPage} from './page/films.page';
import {hasRoleRouteGuard} from '../../auth/route-guards/has-role-route.guard';
import {UserRoleDto} from '../../api';

export const FILMS_ROUTES: Routes = [
  {
    path: '',
    component: FilmsPage
  },
  {
    path: 'create',
    canActivate: [hasRoleRouteGuard(UserRoleDto.CONTENT_MANAGER)],
    loadComponent: () => import('./create/page/create-film.page').then(m => m.CreateFilmPage)
  }
]
