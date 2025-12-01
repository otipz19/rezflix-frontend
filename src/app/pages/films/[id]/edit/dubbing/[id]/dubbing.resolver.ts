import {resolveEntityById} from '@shared/routing/resolve-entity-by-id';
import {inject} from '@angular/core';
import {DubbingDto, FilmDubbingControllerService} from '../../../../../../api';

export const DUBBING_ID_ROUTE_PARAM = "dubbingId";
export const RESOLVE_DUBBING_KEY = "RESOLVE_DUBBING_KEY";

export const resolveDubbing = resolveEntityById<DubbingDto>(
  DUBBING_ID_ROUTE_PARAM,
  (id) => inject(FilmDubbingControllerService).getDubbing(id)
);
