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
import {DeleteDubbingService} from './services/delete-dubbing.service';
import {DeleteEpisodeService} from './services/delete-episode.service';
import {StarRatingBarComponent} from '@shared/components/star-rating-bar/star-rating-bar.component';
import {FilmUserRatingStore} from './film-user-rating.store';
import {FilmUserRatingService} from './services/film-user-rating.service';
import {CommentsSectionComponent} from './components/comments-section/comments-section.component';
import {UploadFilmPosterService} from './services/upload-film-poster.service';
import {ImageFileStore} from '../../../core/image/image-file.store';
import {FilmPosterLoaderDirective} from '../../../core/image/directives/film-poster-loader.directive';

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
    StarRatingBarComponent,
    CommentsSectionComponent,
    FilmPosterLoaderDirective,
  ],
  providers: [FilmStore, FilmUserRatingStore]
})
export class FilmPage {
  private readonly store = inject(FilmStore);
  private readonly router = inject(Router)

  protected readonly auth = inject(AuthService);

  private readonly editFilmInfoService = inject(EditFilmInfoService);
  private readonly deleteFilmService = inject(DeleteFilmService);
  private readonly upsertDubbingService = inject(UpsertDubbingService);
  private readonly upsertEpisodeService = inject(UpsertEpisodeService);
  private readonly deleteDubbingService = inject(DeleteDubbingService);
  private readonly deleteEpisodeService = inject(DeleteEpisodeService);
  private readonly uploadFilmPosterService = inject(UploadFilmPosterService);

  private readonly ratingStore = inject(FilmUserRatingStore);
  private readonly ratingService = inject(FilmUserRatingService);

  private readonly imageStore = inject(ImageFileStore);

  protected readonly film: Signal<FilmDto> = this.store.film;
  protected readonly dubbingList: Signal<DubbingDto[]> = this.store.dubbingList;

  protected readonly isLoading: Signal<boolean> = this.store.isLoading;

  protected readonly activeDubbingId: Signal<DubbingDto['id'] | undefined> = this.store.activeDubbingId;
  protected readonly activeEpisodeId: Signal<EpisodeDto['id'] | undefined> = this.store.activeEpisodeId;
  protected readonly activeEpisodes: Signal<EpisodeDto[]> = this.store.activeEpisodes;

  protected readonly activeEpisodeLink: Signal<string | undefined> = this.store.activeEpisodeLink;
  protected readonly activeEpisodeMessage: Signal<string> = this.store.activeEpisodeMessage;

  protected readonly userRating: Signal<number> = this.ratingStore.userRating;

  constructor() {
    const film = getFromRoute<FilmDto>(RESOLVE_FILM_KEY);
    this.store.useFilm(film);
    this.store.loadDubbingListWithEpisodes();
    this.ratingStore.loadUserRating(film.id);
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

  protected onEditDubbing(dubbing: DubbingDto) {
    this.upsertDubbingService.update$(dubbing)
      .subscribe(() => this.store.loadDubbingListWithEpisodes());
  }

  protected onDeleteDubbing(dubbing: DubbingDto) {
    this.deleteDubbingService.delete$(dubbing.id)
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

  protected onEditEpisode(episode: EpisodeDto) {
    this.upsertEpisodeService.update$(episode)
      .subscribe(() => this.store.loadDubbingListWithEpisodes());
  }

  protected onDeleteEpisode(episode: EpisodeDto) {
    this.deleteEpisodeService.delete$(episode.id)
      .subscribe(() => this.store.loadDubbingListWithEpisodes());
  }

  protected onSetActiveDubbing(dubbingId: DubbingDto['id']) {
    this.store.setActiveDubbing(dubbingId);
  }

  protected onSetActiveEpisode(episodeId: EpisodeDto['id']) {
    this.store.setActiveEpisode(episodeId);
  }

  protected onSetUserRating(rating: number) {
    this.ratingService.setUserRating$(this.film().id, rating)
      .subscribe(() => {
        this.ratingStore.loadUserRating(this.film().id, rating);
        this.store.reloadFilm();
      });
  }

  protected onEditPoster() {
    this.uploadFilmPosterService.upload$(this.film().id)
      .subscribe(() => this.imageStore.loadNewFilmPoster(this.film().id));
  }

  protected readonly UserRoleDto = UserRoleDto;
}
