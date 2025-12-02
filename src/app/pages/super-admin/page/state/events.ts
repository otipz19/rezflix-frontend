import {eventGroup} from '@ngrx/signals/events';
import {type} from '@ngrx/signals';
import {UserListDto, UserTypeDto} from '../../../../api';
import {PaginationChangedEvent} from '@shared/components/paginator/pagination-changed-event';

export const superAdminPageEvents = eventGroup({
  source: 'Super Admin Page',
  events: {
    opened: type<void>(),
    searchQueryChanged: type<string>(),
    typeChanged: type<UserTypeDto | null>(),
    paginationChanged: type<PaginationChangedEvent>(),
    fetchListSuccess: type<UserListDto>(),
    fetchListFailed: type<any>()
  }
});
