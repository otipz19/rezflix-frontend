import {resolveEntityByStringId} from '@shared/routing/resolve-entity-by-id';
import {inject} from '@angular/core';
import {EpisodeDto, FilmEpisodeControllerService} from '../../../../../../../../api';

export const EPISODE_ID_ROUTE_PARAM = "episodeId";
export const RESOLVE_EPISODE_KEY = "RESOLVE_EPISODE_KEY";

export const resolveEpisode = resolveEntityByStringId<EpisodeDto>(
  EPISODE_ID_ROUTE_PARAM,
  (id) => inject(FilmEpisodeControllerService).getEpisode(id)
);
