import {Routes} from '@angular/router';
import {FilmsPage} from './page/films.page';
import {hasRoleRouteGuard} from '../../core/auth/route-guards/has-role-route.guard';
import {UserRoleDto} from '../../api';
import {FILM_ID_ROUTE_PARAM, RESOLVE_FILM_KEY, resolveFilm} from './[id]/film.resolver';
import {DUBBING_ID_ROUTE_PARAM, RESOLVE_DUBBING_KEY, resolveDubbing} from './[id]/edit/dubbing/[id]/dubbing.resolver';

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
    children: [
      {
        path: 'edit',
        canActivate: [hasRoleRouteGuard(UserRoleDto.CONTENT_MANAGER)],
        loadComponent: () => import('./[id]/edit/film-edit.page').then(m => m.FilmEditPage),
        children: [
          {
            path: 'dubbing',
            children: [
              {
                path: `:${DUBBING_ID_ROUTE_PARAM}`,
                resolve: {[RESOLVE_DUBBING_KEY]: resolveDubbing},
                loadComponent: () => import('./[id]/edit/dubbing/[id]/dubbing-page.component').then(m => m.DubbingPageComponent)
              }
            ]
          }
        ]
      },
    ]
  }
]
