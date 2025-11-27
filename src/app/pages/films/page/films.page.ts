import {ChangeDetectionStrategy, Component, inject, OnInit, Signal} from '@angular/core';
import {FilmsPageStore} from './state/store';
import {injectDispatch} from '@ngrx/signals/events';
import {filmsPageEvents} from './state/events';
import {FilmDto} from '../../../api';
import {FilmCardComponent} from './components/film-card/film-card.component';
import {SearchBarComponent} from './components/search-bar/search-bar.component';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';

@Component({
  selector: 'app-films-page',
  imports: [
    FilmCardComponent,
    SearchBarComponent
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
  }

  protected onQueryChanged(query: string) {
    this.searchQueryChange$.next(query);
  }
}
