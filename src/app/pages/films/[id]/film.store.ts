import {computed, inject} from '@angular/core';
import {
  DubbingDto,
  EpisodeDto, EpisodeStatusDto,
  FilmControllerService,
  FilmDto,
  FilmDubbingControllerService, FilmEpisodeControllerService,
  UpsertFilmDto
} from '../../../api';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {NotifyService} from '../../../core/notify/services/notify.service';
import {catchError, finalize, forkJoin, map, of, switchMap, tap} from 'rxjs';
import {AuthService} from '../../../core/auth/services/auth.service';

type FilmState = {
  _film: FilmDto | undefined;
  isLoading: boolean;
  dubbingList: DubbingDto[];
  dubbingMap: Map<DubbingDto['id'], EpisodeDto[]>;
  activeDubbingId: DubbingDto['id'] | undefined;
  activeEpisodeId: EpisodeDto['id'] | undefined;
};

export const FilmStore = signalStore(
  withState<FilmState>({
    _film: undefined,
    isLoading: false,
    dubbingList: [],
    dubbingMap: new Map(),
    activeDubbingId: undefined,
    activeEpisodeId: undefined
  }),

  withComputed((store) => ({
    film: computed(() => {
      const film = store._film();
      if (film == undefined) {
        throw new Error("FilmStore: film is undefined");
      }
      return film;
    }),

    activeEpisodes: computed(() => {
      const activeDubId = store.activeDubbingId();
      if (!activeDubId) {
        return [];
      }

      const arr = store.dubbingMap().get(activeDubId);
      if (!arr) {
        return [];
      }
      const episodes = [...arr];
      episodes.sort((a, b) => a.watchOrder - b.watchOrder);
      return episodes;
    })
  })),

  withComputed((store) => ({
    lastWatchOrder: computed(() => {
      const eps = store.activeEpisodes();
      return eps.length === 0 ? -1 : eps[eps.length - 1].watchOrder;
    }),

    activeEpisode: computed(() => {
      const eps = store.activeEpisodes();
      return eps.length === 0 ? undefined : eps.find(e => e.id === store.activeEpisodeId());
    }),
  })),

  withComputed((store) => ({
    activeEpisodeLink: computed(() => {
      const activeEp = store.activeEpisode();
      if(activeEp && activeEp.hlsLink) {
        return 'http://localhost:8080' + activeEp.hlsLink;
      }
      return undefined;
    }),

    activeEpisodeMessage: computed(() => {
      const ep = store.activeEpisode();

      if (!ep) {
        return '';
      }

      switch (ep.status) {
        case EpisodeStatusDto.RENDERED:
          return 'Episode is ready to be displayed';
        case EpisodeStatusDto.BEING_RENDERED:
          return 'Episode is being rendered';
        case EpisodeStatusDto.RENDERING_FAILED:
          return 'Episode has failed to render';
      }
    })
  })),

  withMethods(
    (
      store,
      filmApi = inject(FilmControllerService),
      dubbingApi = inject(FilmDubbingControllerService),
      episodeApi = inject(FilmEpisodeControllerService),
      auth = inject(AuthService),
      notify = inject(NotifyService)
    ) => ({
      useFilm(film: FilmDto): void {
        patchState(store, {_film: film});
      },

      updateFilm(updatedDto: UpsertFilmDto): void {
        const oldVal = store.film();
        patchState(store, {_film: {...oldVal, ...updatedDto}});

        filmApi.getFilm(store.film().id)
          .pipe(
            tap({
              error: () => patchState(store, {_film: oldVal})
            }),
            notify.notifyHttpError()
          )
          .subscribe(film => patchState(store, {_film: film}));
      },

      setActiveDubbing(dubbingId: DubbingDto['id']): void {
        const dubMap = store.dubbingMap();
        const eps = dubMap.get(dubbingId);
        if (!eps) {
          throw new Error('Not existing dubbing');
        }
        const activeEpisodeId = eps.length === 0 ? undefined : eps[0].id;
        patchState(store, {activeDubbingId: dubbingId, activeEpisodeId});
      },

      setActiveEpisode(episodeId: EpisodeDto['id']): void {
        const eps = store.activeEpisodes();
        const activeEp = eps.find(ep => ep.id === episodeId);
        if(!activeEp) {
          throw new Error('Not active episode');
        }
        patchState(store, {activeEpisodeId: activeEp.id});
      },

      loadDubbingListWithEpisodes(): void {
        patchState(store, {
          isLoading: true,
          dubbingList: [],
          dubbingMap: new Map(),
          activeDubbingId: undefined,
          activeEpisodeId: undefined
        });

        // TODO: find better way to load all items without pagination
        dubbingApi.getDubbingsByCriteria({filmId: store.film().id, size: 1000})
          .pipe(
            map(dubbingList => dubbingList.items),
            tap(dubbings => {
              patchState(store, {dubbingList: dubbings})
            }),
            switchMap(dubbings => {
              if (!dubbings.length) {
                return of([]);
              }

              return forkJoin(dubbings.map(dubbing =>
                forkJoin([of(dubbing.id), episodeApi.getEpisodesByCriteria(dubbing.id, {size: 1000})
                  .pipe(
                    map(({items}) => items)
                  )
                ])
              ));
            }),
            tap(dubbingMapEntries => {
              dubbingMapEntries.forEach(([dubbingId, episodes]) => {
                const dubbingMap = store.dubbingMap();
                dubbingMap.set(dubbingId, episodes);
                patchState(store, {dubbingMap});
              });
            }),
            tap(dubbingMapEntries => {
              if (!dubbingMapEntries.length) {
                patchState(store, {activeDubbingId: undefined, activeEpisodeId: undefined});
                return;
              }

              const nonEmptyDubbing = dubbingMapEntries
                .find(([, episodes]) => episodes.length > 0);

              if (!nonEmptyDubbing) {
                patchState(store, {activeDubbingId: dubbingMapEntries[0][0], activeEpisodeId: undefined});
              } else {
                const [activeDubbingId, [{id: activeEpisodeId}]] = nonEmptyDubbing;
                patchState(store, {activeDubbingId, activeEpisodeId});
              }
            }),
            catchError(err => {
              patchState(store, {
                dubbingList: [],
                dubbingMap: new Map(),
                activeDubbingId: undefined,
                activeEpisodeId: undefined
              });
              return err;
            }),
            finalize(() => patchState(store, {isLoading: false})),
            notify.notifyHttpError()
          )
          .subscribe();
      }
    })),
);
