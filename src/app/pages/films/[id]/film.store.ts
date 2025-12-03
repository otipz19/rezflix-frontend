import {computed, inject, Injectable, linkedSignal, signal} from '@angular/core';
import {
  DubbingDto,
  EpisodeDto,
  EpisodeStatusDto,
  FilmControllerService,
  FilmDto,
  FilmDubbingControllerService,
  FilmEpisodeControllerService,
  UpsertFilmDto,
  UserRoleDto
} from '../../../api';
import {NotifyService} from '../../../core/notify/services/notify.service';
import {catchError, finalize, forkJoin, map, of, switchMap, tap} from 'rxjs';
import {AuthService} from '../../../core/auth/services/auth.service';
import {environment} from '../../../../environments/environment';

@Injectable()
export class FilmStore {
  private readonly filmApi = inject(FilmControllerService);
  private readonly dubbingApi = inject(FilmDubbingControllerService);
  private readonly episodeApi = inject(FilmEpisodeControllerService);
  private readonly auth = inject(AuthService);
  private readonly notify = inject(NotifyService);

  private readonly _film = signal<FilmDto | undefined>(undefined);
  readonly film = computed(() => {
    const film = this._film();
    if (film == undefined) {
      throw new Error("FilmStore: film is undefined");
    }
    return film;
  });

  private readonly _isLoading = signal(false);
  readonly isLoading = this._isLoading.asReadonly();

  private readonly _dubbingList = signal<DubbingDto[]>([]);
  readonly dubbingList = this._dubbingList.asReadonly();

  private readonly _dubbingMap = signal<Map<DubbingDto['id'], EpisodeDto[]>>(new Map());
  readonly dubbingMap = this._dubbingMap.asReadonly();

  private readonly _activeDubbingId = linkedSignal<{
    dMap: Map<DubbingDto['id'], EpisodeDto[]>,
    dList: DubbingDto[]
  }, DubbingDto['id'] | undefined>({
    source: () => ({
      dMap: this.dubbingMap(),
      dList: this.dubbingList()
    }),
    computation: (newSource, previous) => {
      if (previous?.value && newSource.dMap.get(previous.value)) {
        return previous.value;
      }
      return newSource.dList[0]?.id;
    }
  });

  readonly activeDubbingId = this._activeDubbingId.asReadonly();

  readonly activeEpisodes = computed(() => {
    const activeDubId = this.activeDubbingId();
    if (!activeDubId) {
      return [];
    }

    const arr = this.dubbingMap().get(activeDubId);
    if (!arr) {
      return [];
    }
    let episodes = [...arr];
    if (this.auth.role() != UserRoleDto.CONTENT_MANAGER) {
      episodes = episodes.filter(e => e.status === EpisodeStatusDto.RENDERED);
    }
    episodes.sort((a, b) => a.watchOrder - b.watchOrder);
    return episodes;
  });

  private readonly _activeEpisode = linkedSignal<EpisodeDto[], EpisodeDto | undefined>({
    source: this.activeEpisodes,
    computation: (newSource, previous) => {
      const prevEp = previous?.value && newSource.find(e => e.id === previous?.value?.id);
      if (prevEp) {
        return prevEp;
      }
      return newSource[0];
    }
  });

  readonly activeEpisode = this._activeEpisode.asReadonly();

  readonly activeEpisodeId = computed(() => this.activeEpisode()?.id);

  readonly lastWatchOrder = computed(() => {
    const eps = this.activeEpisodes();
    return eps.length === 0 ? -1 : eps[eps.length - 1].watchOrder;
  });

  readonly activeEpisodeLink = computed(() => {
    const activeEp = this.activeEpisode();
    if (activeEp && activeEp.hlsLink) {
      return environment.basePath + activeEp.hlsLink;
    }
    return undefined;
  });

  readonly activeEpisodeMessage = computed(() => {
    const ep = this.activeEpisode();

    if (!ep) {
      return 'No active episode';
    }

    switch (ep.status) {
      case EpisodeStatusDto.RENDERED:
        return 'Episode is ready to be displayed';
      case EpisodeStatusDto.BEING_RENDERED:
        return 'Episode is being rendered';
      case EpisodeStatusDto.RENDERING_FAILED:
        return 'Episode has failed to render';
    }
  });

  useFilm(film: FilmDto): void {
    this._film.set(film);
  }

  reloadFilm(): void {
    this.filmApi.getFilm(this.film().id)
      .pipe(
        this.notify.notifyHttpError()
      )
      .subscribe(film => this._film.set(film));
  }

  updateFilm(updatedDto: UpsertFilmDto): void {
    const oldVal = this.film();
    this._film.set({...oldVal, ...updatedDto});

    this.filmApi.getFilm(this.film().id)
      .pipe(
        tap({
          error: () => this._film.set(oldVal)
        }),
        this.notify.notifyHttpError()
      )
      .subscribe(film => this._film.set(film));
  }

  setActiveDubbing(dubbingId: DubbingDto['id']): void {
    const dubMap = this.dubbingMap();
    if (!dubMap.has(dubbingId)) {
      throw new Error('Not existing dubbing');
    }
    this._activeDubbingId.set(dubbingId);
  }

  setActiveEpisode(episodeId: EpisodeDto['id']): void {
    const eps = this.activeEpisodes();
    const activeEp = eps.find(ep => ep.id === episodeId);
    if (!activeEp) {
      throw new Error('Not amongst active episodes');
    }
    this._activeEpisode.set(activeEp);
  }

  loadDubbingListWithEpisodes(): void {
    this._isLoading.set(true);
    this._dubbingList.set([]);
    this._dubbingMap.set(new Map());
    this._activeDubbingId.set(undefined);

    this.dubbingApi.getDubbingsByCriteria({filmId: this.film().id, size: 1000})
      .pipe(
        map(dubbingList => dubbingList.items),
        tap(dubbings => {
          this._dubbingList.set(dubbings);
        }),
        switchMap(dubbings => {
          if (!dubbings.length) {
            return of([]);
          }

          return forkJoin(dubbings.map(dubbing =>
            forkJoin([of(dubbing.id), this.episodeApi.getEpisodesByCriteria(dubbing.id, {size: 1000})
              .pipe(
                map(({items}) => items)
              )
            ])
          ));
        }),
        tap(dubbingMapEntries => {
          dubbingMapEntries.forEach(([dubbingId, episodes]) => {
            this._dubbingMap.update(currentMap => {
              const newMap = new Map(currentMap);
              newMap.set(dubbingId, episodes);
              return newMap;
            });
          });
        }),
        catchError(err => {
          this._dubbingList.set([]);
          this._dubbingMap.set(new Map());
          this._activeDubbingId.set(undefined);
          return err;
        }),
        finalize(() => this._isLoading.set(false)),
        this.notify.notifyHttpError()
      )
      .subscribe();
  }
}
