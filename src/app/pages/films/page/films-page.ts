import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {FilmsPageStore} from './state/store';
import {injectDispatch} from '@ngrx/signals/events';
import {filmsPageEvents} from './state/events';

@Component({
  selector: 'app-films-page',
  imports: [],
  templateUrl: './films-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FilmsPageStore]
})
export class FilmsPage implements OnInit {
  private readonly store = inject(FilmsPageStore);
  private readonly dispatch = injectDispatch(filmsPageEvents);

  ngOnInit() {
    this.dispatch.opened();
  }
}
