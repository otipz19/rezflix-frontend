import {FilmControllerService, FilmDto} from '../../../../api';
import {signalStore, withState} from '@ngrx/signals';
import {Events, on, withEffects, withReducer} from '@ngrx/signals/events';
import {inject} from '@angular/core';
import {filmsPageEvents} from './events';
import {switchMap, tap} from 'rxjs';
import {mapResponse} from '@ngrx/operators';
import {NotifyService} from '../../../../notify/services/notify.service';
import {HttpErrorResponse} from '@angular/common/http';

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
    pageSize: 8
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
    api = inject(FilmControllerService),
    notify = inject(NotifyService)
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
                error: err => filmsPageEvents.fetchListFailed(err)
              })
            )
        })
      ),

    notifyLoadError$: events
      .on(filmsPageEvents.fetchListFailed)
      .pipe(
        tap(({payload: err}) => {
          if(err instanceof HttpErrorResponse) {
            notify.showErrorToast(err.message);
          } else {
            console.log(err);
          }
        })
      )
  }))
);
