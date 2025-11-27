import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {FilmDto} from '../../../../../api';

@Component({
  selector: 'app-film-card',
  imports: [
  ],
  templateUrl: './film-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmCardComponent {
  readonly film = input.required<FilmDto>();
}
