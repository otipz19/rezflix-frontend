import {computed, inject, Injectable, signal} from '@angular/core';
import {FilmControllerService, FilmDto, UpsertFilmDto} from '../../../api';
import {NotifyService} from '../../../core/notify/services/notify.service';
import {tap} from 'rxjs';

@Injectable()
export class FilmStore {
  private readonly api = inject(FilmControllerService);
  private readonly notify = inject(NotifyService);

  private readonly _film = signal<FilmDto | undefined>(undefined);
  readonly film = computed(() => {
    const film = this._film();
    if (film == undefined) {
      throw new Error("FilmStore: film is not set");
    }
    return film;
  });

  useFilm(film: FilmDto) {
    this._film.set(film);
  }

  update(updatedDto: UpsertFilmDto) {
    const oldVal = this.film();
    this._film.set({...oldVal, ...updatedDto});

    this.api.getFilm(this.film().id)
      .pipe(
        tap({
          error: () => this._film.set(oldVal)
        }),
        this.notify.notifyHttpError()
      )
      .subscribe(film => this._film.set(film));
  }
}
