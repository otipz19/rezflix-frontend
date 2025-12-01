import {computed, inject} from '@angular/core';
import {DubbingDto, FilmControllerService, FilmDto, FilmDubbingControllerService, UpsertFilmDto} from '../../../../api';
import {patchState, signalStore, withComputed, withMethods, withState} from '@ngrx/signals';
import {NotifyService} from '../../../../core/notify/services/notify.service';
import {tap} from 'rxjs';

type FilmState = {
  _film: FilmDto | undefined;
  dubbingList: DubbingDto[];
  isLoadingDubbingList: boolean;
};

export const FilmStore = signalStore(
  withState<FilmState>({
    _film: undefined,
    dubbingList: [],
    isLoadingDubbingList: false
  }),

  withComputed((store) => ({
    film: computed(() => {
      const film = store._film();
      if (film == undefined) {
        throw new Error("FilmStore: film is not set");
      }
      return film;
    })
  })),

  withMethods(
    (
      store,
      filmApi = inject(FilmControllerService),
      dubbingApi = inject(FilmDubbingControllerService),
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

      loadDubbingList(): void {
        patchState(store, {isLoadingDubbingList: true});
        // TODO: find better way to load all items without pagination
        dubbingApi.getDubbingsByCriteria({filmId: store.film().id, size: 1000})
          .pipe(
            tap(list => {
              patchState(store, {dubbingList: list.items, isLoadingDubbingList: false})
            }),
            notify.notifyHttpError()
          )
          .subscribe();
      }
    })),
);
