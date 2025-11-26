import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {FilmDto} from '../../../../../api';

@Component({
  selector: 'app-film-card',
  imports: [
  ],
  templateUrl: './film-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmCard {
  readonly film = input.required<FilmDto>();
}
