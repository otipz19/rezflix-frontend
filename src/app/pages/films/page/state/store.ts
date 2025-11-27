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
  searchQuery: string,
  pageIndex: number,
  pageSize: number
};

export const FilmsPageStore = signalStore(
  withState<FilmsPageState>({
    films: [],
    total: 0,
    isLoading: false,
    searchQuery: '',
    pageIndex: 0,
    pageSize: 5
  }),

  withReducer(
    on(
      filmsPageEvents.opened,
      () => ({isLoading: true})
    ),

    on(
      filmsPageEvents.searchQueryChanged,
      ({payload: searchQuery}) => ({isLoading: true, searchQuery})
    ),

    on(
      filmsPageEvents.paginationChanged,
      ({payload: {pageIndex, pageSize}}) => ({isLoading: true, pageIndex, pageSize})
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
    loadFilmsList$: events
      .on(filmsPageEvents.opened, filmsPageEvents.searchQueryChanged, filmsPageEvents.paginationChanged)
      .pipe(
        switchMap(() => {
          const query = store.searchQuery();
          const pageIndex = store.pageIndex();
          const pageSize = store.pageSize();

          return api.getFilmsByCriteria({query, page: pageIndex, size: pageSize})
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
