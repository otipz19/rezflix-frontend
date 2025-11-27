import {eventGroup} from '@ngrx/signals/events';
import {type} from '@ngrx/signals';
import {FilmListDto} from '../../../../api';

export const filmsPageEvents = eventGroup({
  source: 'Films Page',
  events: {
    opened: type<void>(),
    searchQueryChanged: type<string>(),
    fetchListSuccess: type<FilmListDto>(),
    fetchListFailed: type<string>()
  }
});
