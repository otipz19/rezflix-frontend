import {Routes} from '@angular/router';
import {FilmsPage} from './page/films.page';
import {hasRoleRouteGuard} from '../../core/auth/route-guards/has-role-route.guard';
import {UserRoleDto} from '../../api';
import {FILM_ID_ROUTE_PARAM, RESOLVE_FILM_KEY, resolveFilm} from './[id]/film.resolver';

export const FILMS_ROUTES: Routes = [
  {
    path: '',
    component: FilmsPage
  },
  {
    path: 'create',
    canActivate: [hasRoleRouteGuard(UserRoleDto.CONTENT_MANAGER)],
    loadComponent: () => import('./create/page/create-film.page').then(m => m.CreateFilmPage)
  },
  {
    path: `:${FILM_ID_ROUTE_PARAM}`,
    resolve: {[RESOLVE_FILM_KEY]: resolveFilm},
    loadComponent: () => import('./[id]/film.page').then(m => m.FilmPage)
  }
]
