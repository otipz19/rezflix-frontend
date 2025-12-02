import {ChangeDetectionStrategy, Component, inject, Signal} from '@angular/core';
import {DubbingDto, EpisodeDto, FilmDto, UserRoleDto} from '../../../api';
import {getFromRoute} from '@shared/routing/get-from-route';
import {RESOLVE_FILM_KEY} from './film.resolver';
import {ZardButtonComponent} from '@shared/zardui/components/button/button.component';
import {ZardIconComponent} from '@shared/zardui/components/icon/icon.component';
import {EditFilmInfoService} from './services/edit-film-info.service';
import {DeleteFilmService} from './services/delete-film.service';
import {Router} from '@angular/router';
import {FilmStore} from "./film.store";
import {UpsertDubbingService} from './services/upsert-dubbing.service';
import {UpsertEpisodeService} from './services/upsert-episode.service';
import {AuthService} from '../../../core/auth/services/auth.service';
import {ZardDividerComponent} from '@shared/zardui/components/divider/divider.component';
import {ZardDropdownDirective} from '@shared/zardui/components/dropdown/dropdown-trigger.directive';
import {ZardDropdownMenuContentComponent} from '@shared/zardui/components/dropdown/dropdown-menu-content.component';
import {ZardDropdownMenuItemComponent} from '@shared/zardui/components/dropdown/dropdown-item.component';

@Component({
  selector: 'app-film-edit-page',
  templateUrl: './film.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardButtonComponent,
    ZardIconComponent,
    ZardDividerComponent,
    ZardDropdownDirective,
    ZardDropdownMenuContentComponent,
    ZardDropdownMenuItemComponent,
  ],
  providers: [FilmStore]
})
export class FilmPage {
  private readonly store = inject(FilmStore);
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);

  private readonly editFilmInfoService = inject(EditFilmInfoService);
  private readonly deleteFilmService = inject(DeleteFilmService);
  private readonly upsertDubbingService = inject(UpsertDubbingService);
  private readonly upsertEpisodeService = inject(UpsertEpisodeService);

  protected readonly film: Signal<FilmDto> = this.store.film;
  protected readonly dubbingList: Signal<DubbingDto[]> = this.store.dubbingList;

  protected readonly isLoading: Signal<boolean> = this.store.isLoading;

  protected readonly activeDubbingId: Signal<DubbingDto['id'] | undefined> = this.store.activeDubbingId;
  protected readonly activeEpisodeId: Signal<EpisodeDto['id'] | undefined> = this.store.activeEpisodeId;
  protected readonly activeEpisodes: Signal<EpisodeDto[]> = this.store.activeEpisodes;

  protected readonly activeEpisodeLink: Signal<string | undefined> = this.store.activeEpisodeLink;
  protected readonly activeEpisodeMessage: Signal<string> = this.store.activeEpisodeMessage;

  constructor() {
    this.store.useFilm(getFromRoute<FilmDto>(RESOLVE_FILM_KEY));
    this.store.loadDubbingListWithEpisodes();
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
      // TODO: prevent full reload
      .subscribe(() => this.store.loadDubbingListWithEpisodes());
  }

  protected onAddNewEpisode() {
    const activeDubId = this.activeDubbingId();
    if(activeDubId) {
      this.upsertEpisodeService.create$(activeDubId, this.store.lastWatchOrder())
        // TODO: prevent full reload
        .subscribe(() => this.store.loadDubbingListWithEpisodes());
    }
  }

  protected onSetActiveDubbing(dubbingId: DubbingDto['id']) {
    this.store.setActiveDubbing(dubbingId);
  }

  protected onSetActiveEpisode(episodeId: EpisodeDto['id']) {
    this.store.setActiveEpisode(episodeId);
  }

  protected readonly UserRoleDto = UserRoleDto;
}
