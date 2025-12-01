import {
  DubbingDto,
  EpisodeDto,
  FilmEpisodeControllerService
} from '../../../../../../api';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {computed, inject} from '@angular/core';
import {NotifyService} from '../../../../../../core/notify/services/notify.service';
import {finalize, tap} from 'rxjs';

type DubbingState = {
  _dubbing: DubbingDto | undefined;
  episodes: EpisodeDto[];
  isLoadingEpisodes: boolean;
};

export const DubbingStore = signalStore(
  withState<DubbingState>({
    _dubbing: undefined,
    episodes: [],
    isLoadingEpisodes: false
  }),

  withComputed((store) => ({
    dubbing: computed(() => {
      const dubbing = store._dubbing();
      if (dubbing == undefined) {
        throw new Error("DubbingStore: dubbing is undefined");
      }
      return dubbing;
    }),

    sortedEpisodes: computed(() => {
      const episodes = [...store.episodes()];
      episodes.sort((a, b) => a.watchOrder - b.watchOrder);
      return episodes;
    })
  })),

  withComputed((store) => ({
    lastWatchOrder: computed(() => {
      const eps = store.sortedEpisodes();
      return eps.length === 0 ? -1 : eps[eps.length - 1].watchOrder;
    })
  })),

  withMethods(
    (
      store,
      episodesApi = inject(FilmEpisodeControllerService),
      notify = inject(NotifyService)
    ) => ({
      useDubbing(dubbing: DubbingDto): void {
        patchState(store, {_dubbing: dubbing});
      },

      loadEpisodes(): void {
        patchState(store, {isLoadingEpisodes: true});
        // TODO: find better way to load all items without pagination
        episodesApi.getEpisodesByCriteria(store.dubbing().id, {size: 1000})
          .pipe(
            tap(list => {
              patchState(store, {episodes: list.items, isLoadingEpisodes: false})
            }),
            finalize(() => patchState(store, {isLoadingEpisodes: false})),
            notify.notifyHttpError()
          )
          .subscribe();
      }
    })),
);
