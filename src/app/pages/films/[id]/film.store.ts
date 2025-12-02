import { computed, inject, Injectable, signal } from '@angular/core';
import {
  DubbingDto,
  EpisodeDto,
  EpisodeStatusDto,
  FilmControllerService,
  FilmDto,
  FilmDubbingControllerService,
  FilmEpisodeControllerService,
  UpsertFilmDto
} from '../../../api';
import { NotifyService } from '../../../core/notify/services/notify.service';
import { catchError, finalize, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../../../core/auth/services/auth.service';

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

  private readonly _activeDubbingId = signal<DubbingDto['id'] | undefined>(undefined);
  readonly activeDubbingId = this._activeDubbingId.asReadonly();

  private readonly _activeEpisodeId = signal<EpisodeDto['id'] | undefined>(undefined);
  readonly activeEpisodeId = this._activeEpisodeId.asReadonly();

  readonly activeEpisodes = computed(() => {
    const activeDubId = this.activeDubbingId();
    if (!activeDubId) {
      return [];
    }

    const arr = this.dubbingMap().get(activeDubId);
    if (!arr) {
      return [];
    }
    const episodes = [...arr];
    episodes.sort((a, b) => a.watchOrder - b.watchOrder);
    return episodes;
  });

  readonly lastWatchOrder = computed(() => {
    const eps = this.activeEpisodes();
    return eps.length === 0 ? -1 : eps[eps.length - 1].watchOrder;
  });

  readonly activeEpisode = computed(() => {
    const eps = this.activeEpisodes();
    return eps.length === 0 ? undefined : eps.find(e => e.id === this.activeEpisodeId());
  });

  readonly activeEpisodeLink = computed(() => {
    const activeEp = this.activeEpisode();
    if (activeEp && activeEp.hlsLink) {
      return 'http://localhost:8080' + activeEp.hlsLink;
    }
    return undefined;
  });

  readonly activeEpisodeMessage = computed(() => {
    const ep = this.activeEpisode();

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
  });

  useFilm(film: FilmDto): void {
    this._film.set(film);
  }

  updateFilm(updatedDto: UpsertFilmDto): void {
    const oldVal = this.film();
    this._film.set({ ...oldVal, ...updatedDto });

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
    const eps = dubMap.get(dubbingId);
    if (!eps) {
      throw new Error('Not existing dubbing');
    }
    const activeEpisodeId = eps.length === 0 ? undefined : eps[0].id;
    this._activeDubbingId.set(dubbingId);
    this._activeEpisodeId.set(activeEpisodeId);
  }

  setActiveEpisode(episodeId: EpisodeDto['id']): void {
    const eps = this.activeEpisodes();
    const activeEp = eps.find(ep => ep.id === episodeId);
    if (!activeEp) {
      throw new Error('Not active episode');
    }
    this._activeEpisodeId.set(activeEp.id);
  }

  loadDubbingListWithEpisodes(): void {
    this._isLoading.set(true);
    this._dubbingList.set([]);
    this._dubbingMap.set(new Map());
    this._activeDubbingId.set(undefined);
    this._activeEpisodeId.set(undefined);

    this.dubbingApi.getDubbingsByCriteria({ filmId: this.film().id, size: 1000 })
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
            forkJoin([of(dubbing.id), this.episodeApi.getEpisodesByCriteria(dubbing.id, { size: 1000 })
              .pipe(
                map(({ items }) => items)
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
        tap(dubbingMapEntries => {
          if (!dubbingMapEntries.length) {
            this._activeDubbingId.set(undefined);
            this._activeEpisodeId.set(undefined);
            return;
          }

          const nonEmptyDubbing = dubbingMapEntries
            .find(([, episodes]) => episodes.length > 0);

          if (!nonEmptyDubbing) {
            this._activeDubbingId.set(dubbingMapEntries[0][0]);
            this._activeEpisodeId.set(undefined);
          } else {
            const [activeDubbingId, [{ id: activeEpisodeId }]] = nonEmptyDubbing;
            this._activeDubbingId.set(activeDubbingId);
            this._activeEpisodeId.set(activeEpisodeId);
          }
        }),
        catchError(err => {
          this._dubbingList.set([]);
          this._dubbingMap.set(new Map());
          this._activeDubbingId.set(undefined);
          this._activeEpisodeId.set(undefined);
          return err;
        }),
        finalize(() => this._isLoading.set(false)),
        this.notify.notifyHttpError()
      )
      .subscribe();
  }
}
