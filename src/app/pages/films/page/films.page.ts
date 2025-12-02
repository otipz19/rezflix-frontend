import {ChangeDetectionStrategy, Component, inject, OnInit, Signal, signal} from '@angular/core';
import {FilmsPageStore} from './state/store';
import {injectDispatch} from '@ngrx/signals/events';
import {filmsPageEvents} from './state/events';
import {FilmDto} from '../../../api';
import {FilmCardComponent} from './components/film-card/film-card.component';
import {SearchBarComponent} from './components/search-bar/search-bar.component';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {PaginatorComponent} from '@shared/components/paginator/paginator.component';
import {PaginationChangedEvent} from '@shared/components/paginator/pagination-changed-event';
import {FilmCardSkeletonComponent} from './components/film-card-skeleton/film-card-skeleton.component';
import {RouterLink} from '@angular/router';
import {ZardCarouselComponent} from '@shared/zardui/components/carousel/carousel.component';
import {ZardCarouselContentComponent} from '@shared/zardui/components/carousel/carousel-content.component';
import {ZardCarouselItemComponent} from '@shared/zardui/components/carousel/carousel-item.component';
import {AuthService} from '../../../core/auth/services/auth.service';
import {FilmRecommendationsControllerService, UserRoleDto} from '../../../api';
import {ZardCarouselPluginsService} from '@shared/zardui/components/carousel/carousel-plugins.service';

@Component({
  selector: 'app-films-page',
  imports: [
    FilmCardComponent,
    SearchBarComponent,
    PaginatorComponent,
    FilmCardSkeletonComponent,
    RouterLink,
    ZardCarouselComponent,
    ZardCarouselContentComponent,
    ZardCarouselItemComponent,
  ],
  templateUrl: './films.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FilmsPageStore]
})
export class FilmsPage implements OnInit {
  private readonly store = inject(FilmsPageStore);
  private readonly dispatch = injectDispatch(filmsPageEvents);

  private readonly searchQueryChange$ = new Subject<string>();

  protected readonly films: Signal<FilmDto[]> = this.store.films;
  protected readonly pageIndex: Signal<number> = this.store.pageIndex;
  protected readonly pageSize: Signal<number> = this.store.pageSize;
  protected readonly totalFilms: Signal<number> = this.store.total;
  protected readonly isLoading: Signal<boolean> = this.store.isLoading;

  protected readonly skeletons = Array.from({length: 8});

  protected readonly recommendations = signal<FilmDto[]>([]);

  protected readonly UserRoleDto = UserRoleDto;

  protected readonly auth = inject(AuthService);
  private readonly recommendationsApi = inject(FilmRecommendationsControllerService);
  private readonly carouselPlugins = inject(ZardCarouselPluginsService);

  protected readonly recPlugins = signal<any[]>([]);
  protected readonly recCarouselOptions = { align: 'center', loop: true } as const;

  constructor() {
    this.searchQueryChange$
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(v => this.dispatch.searchQueryChanged(v));
  }

  ngOnInit() {
    this.dispatch.opened();
    this.initCarousel();
  }

  private initCarousel() {
        try {
      if (this.auth.hasRole(UserRoleDto.VIEWER)) {
        this.recommendationsApi.getRecommendations('body', false).subscribe(res => {
          if (res && res.length > 0) {
            this.recommendations.set(res);
          }
        });
      }
    } catch (e) {
      // swallow errors since recommendations are optional
    }

    (async () => {
      try {
        const autoplay = await this.carouselPlugins.createAutoplayPlugin({ delay: 3000, stopOnInteraction: true, playOnInit: true });
        this.recPlugins.set([autoplay]);
      } catch (err) {
        // swallow errors since recommendations are optional
      }
    })();
  }

  protected onQueryChanged(query: string) {
    this.searchQueryChange$.next(query);
  }

  protected onPageChanged(paginationEvent: PaginationChangedEvent) {
    this.dispatch.paginationChanged(paginationEvent);
  }
}
