import {eventGroup} from '@ngrx/signals/events';
import {type} from '@ngrx/signals';
import {FilmListDto} from '../../../../api';
import {PaginationChangedEvent} from '@shared/components/paginator/pagination-changed-event';

export const filmsPageEvents = eventGroup({
  source: 'Films Page',
  events: {
    opened: type<void>(),
    searchQueryChanged: type<string>(),
    paginationChanged: type<PaginationChangedEvent>(),
    fetchListSuccess: type<FilmListDto>(),
    fetchListFailed: type<string>()
  }
});
