import {resolveEntityById} from '@shared/routing/resolve-entity-by-id';
import {FilmControllerService, FilmDto} from '../../../api';
import {inject} from '@angular/core';

export const FILM_ID_ROUTE_PARAM = "filmId";
export const RESOLVE_FILM_KEY = "RESOLVE_FILM_KEY";

export const resolveFilm = resolveEntityById<FilmDto>(
  FILM_ID_ROUTE_PARAM,
  (id) => inject(FilmControllerService).getFilm(id)
);
