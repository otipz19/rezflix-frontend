import {ChangeDetectionStrategy, Component, inject, OnInit, Signal} from '@angular/core';
import {FilmsPageStore} from './state/store';
import {injectDispatch} from '@ngrx/signals/events';
import {filmsPageEvents} from './state/events';
import {FilmDto} from '../../../api';
import {FilmCard} from './components/film-card/film-card';
import {SearchBar} from './components/search-bar/search-bar';

@Component({
  selector: 'app-films-page',
  imports: [
    FilmCard,
    SearchBar
  ],
  templateUrl: './films-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FilmsPageStore]
})
export class FilmsPage implements OnInit {
  private readonly store = inject(FilmsPageStore);
  private readonly dispatch = injectDispatch(filmsPageEvents);

  protected readonly films: Signal<FilmDto[]> = this.store.films;

  ngOnInit() {
    this.dispatch.opened();
  }
}
