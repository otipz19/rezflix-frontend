import {ChangeDetectionStrategy, Component, inject, Signal} from '@angular/core';
import {DubbingDto, FilmDto} from '../../../../api';
import {getFromRoute} from '@shared/routing/get-from-route';
import {RESOLVE_FILM_KEY} from '../film.resolver';
import {ZardButtonComponent} from '@shared/zardui/components/button/button.component';
import {ZardIconComponent} from '@shared/zardui/components/icon/icon.component';
import {EditFilmInfoService} from './services/edit-film-info.service';
import {DeleteFilmService} from './services/delete-film.service';
import {Router} from '@angular/router';
import {FilmStore} from "../state/film.store";
import {UpsertDubbingService} from './services/upsert-dubbing.service';

@Component({
  selector: 'app-film-edit-page',
  templateUrl: './film-edit.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardButtonComponent,
    ZardIconComponent
  ],
  providers: [FilmStore]
})
export class FilmEditPage {
  private readonly store = inject(FilmStore);
  private readonly editFilmInfoService = inject(EditFilmInfoService);
  private readonly deleteFilmService = inject(DeleteFilmService);
  private readonly upsertDubbingService = inject(UpsertDubbingService);
  private readonly router = inject(Router);

  protected readonly film: Signal<FilmDto> = this.store.film;
  protected readonly dubbingList: Signal<DubbingDto[]> = this.store.dubbingList;
  protected readonly isLoadingDubbing: Signal<boolean> = this.store.isLoadingDubbingList;

  constructor() {
    this.store.useFilm(getFromRoute<FilmDto>(RESOLVE_FILM_KEY));
    this.store.loadDubbingList();
  }

  protected onEditFilmInfo() {
    this.editFilmInfoService.edit$(this.film().id, this.film())
      .subscribe(updatedFilm => this.store.updateFilm(updatedFilm));
  }

  protected onDeleteFilm() {
    this.deleteFilmService.delete$(this.film().id)
      .subscribe(() => this.router.navigate(['/']));
  }

  protected onAddNewDubbing() {
    this.upsertDubbingService.create$(this.film().id)
      .subscribe(() => this.store.loadDubbingList());
  }
}
