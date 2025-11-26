import {FilmControllerService, FilmDto} from '../../../../api';
import {signalStore, withState} from '@ngrx/signals';
import {Events, on, withEffects, withReducer} from '@ngrx/signals/events';
import {inject} from '@angular/core';
import {filmsPageEvents} from './events';
import {switchMap} from 'rxjs';
import {mapResponse} from '@ngrx/operators';

type FilmsPageState = {
  films: Array<FilmDto>,
  total: number,
  isLoading: boolean,
};

export const FilmsPageStore = signalStore(
  withState<FilmsPageState>({
    films: [],
    total: 0,
    isLoading: false
  }),

  withReducer(
    on(
      filmsPageEvents.opened,
      () => ({isLoading: true})
    ),

    on(
      filmsPageEvents.fetchListSuccess,
      ({payload: {items: films, total}}) => ({isLoading: false, films, total})
    ),

    on(
      filmsPageEvents.fetchListFailed,
      () => ({isLoading: false, films: [], total: 0})
    )
  ),

  withEffects((
    store,
    events = inject(Events),
    api = inject(FilmControllerService)
  ) => ({
    onOpened$: events
      .on(filmsPageEvents.opened)
      .pipe(
        switchMap(() => {
          return api.getFilmsByCriteria({})
            .pipe(
              mapResponse({
                next: res => filmsPageEvents.fetchListSuccess(res),
                // TODO: add type-checking add use request error messages
                error: () => filmsPageEvents.fetchListFailed("Request failed")
              })
            )
        })
      )
  }))
);
