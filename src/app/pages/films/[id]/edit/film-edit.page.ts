import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FilmDto} from '../../../../api';
import {getFromRoute} from '@shared/routing/get-from-route';
import {RESOLVE_FILM_KEY} from '../film.resolver';

@Component({
  selector: 'app-film-edit-page',
  templateUrl: './film-edit.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class FilmEditPage {
  protected readonly film = signal<FilmDto>(undefined!);

  constructor() {
    this.film.set(getFromRoute<FilmDto>(RESOLVE_FILM_KEY));
  }
}
