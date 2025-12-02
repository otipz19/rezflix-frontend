import {UserControllerService, UserDto, UserListDto, UserTypeDto} from '../../../../api';
import {signalStore, withState} from '@ngrx/signals';
import {Events, on, withEffects, withReducer} from '@ngrx/signals/events';
import {inject} from '@angular/core';
import {superAdminPageEvents} from './events';
import {switchMap, tap} from 'rxjs';
import {mapResponse} from '@ngrx/operators';
import {NotifyService} from '../../../../core/notify/services/notify.service';

type SuperAdminPageState = {
  users: Array<UserDto>;
  total: number;
  pageIndex: number;
  pageSize: number;
  searchQuery: string;
  selectedType: UserTypeDto | null;
  isLoading: boolean;
};

export const SuperAdminPageStore = signalStore(
  withState<SuperAdminPageState>({
    users: [],
    total: 0,
    pageIndex: 0,
    pageSize: 8,
    searchQuery: '',
    selectedType: null,
    isLoading: false
  }),

  withReducer(
    on(
      superAdminPageEvents.opened,
      () => ({isLoading: true})
    ),

    on(
      superAdminPageEvents.searchQueryChanged,
      ({payload: searchQuery}) => ({isLoading: true, searchQuery})
    ),

    on(
      superAdminPageEvents.typeChanged,
      ({payload: selectedType}) => ({isLoading: true, selectedType})
    ),

    on(
      superAdminPageEvents.paginationChanged,
      ({payload: {pageIndex, pageSize}}) => ({isLoading: true, pageIndex, pageSize})
    ),

    on(
      superAdminPageEvents.fetchListSuccess,
      ({payload: {items: users, total}}: {payload: UserListDto}) => ({users, total, isLoading: false})
    ),

    on(
      superAdminPageEvents.fetchListFailed,
      () => ({isLoading: false, users: [], total: 0})
    )
  ),

  withEffects((store, events = inject(Events), api = inject(UserControllerService), notify = inject(NotifyService)) => ({
    loadList$: events
      .on(
        superAdminPageEvents.opened,
        superAdminPageEvents.searchQueryChanged,
        superAdminPageEvents.typeChanged,
        superAdminPageEvents.paginationChanged
      )
      .pipe(
        switchMap(() => {
          const query = store.searchQuery();
          const pageIndex = store.pageIndex();
          const pageSize = store.pageSize();
          const type = store.selectedType();

          const criteria: any = {query, type, page: pageIndex, size: pageSize};
          if (type) {
            criteria.type = type;
          }

          return api.getUsersByCriteria(criteria)
            .pipe(
              mapResponse({
                next: res => superAdminPageEvents.fetchListSuccess(res),
                error: err => superAdminPageEvents.fetchListFailed(err)
              })
            );
        })
      ),

    notifyLoadError$: events
      .on(superAdminPageEvents.fetchListFailed)
      .pipe(
        tap(({payload: err}) => notify.showHttpError(err))
      )
  }))
);
