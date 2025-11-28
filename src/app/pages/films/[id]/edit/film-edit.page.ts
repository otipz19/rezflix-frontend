import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FilmDto} from '../../../../api';
import {getFromRoute} from '@shared/routing/get-from-route';
import {RESOLVE_FILM_KEY} from '../film.resolver';
import {ZardButtonComponent} from '@shared/zardui/components/button/button.component';
import {ZardIconComponent} from '@shared/zardui/components/icon/icon.component';
import {EditFilmInfoService} from './services/edit-film-info.service';

@Component({
  selector: 'app-film-edit-page',
  templateUrl: './film-edit.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardButtonComponent,
    ZardIconComponent
  ]
})
export class FilmEditPage {
  private readonly editFilmInfoService = inject(EditFilmInfoService);

  protected readonly film = signal<FilmDto>(undefined!);

  constructor() {
    this.film.set(getFromRoute<FilmDto>(RESOLVE_FILM_KEY));
  }

  protected onEditFilmInfo() {
    this.editFilmInfoService.edit$(this.film().id, this.film())
      .subscribe();
  }
}
