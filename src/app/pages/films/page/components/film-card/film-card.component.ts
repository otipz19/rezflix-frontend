import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {FilmDto} from '../../../../../api';
import {StarRatingBarComponent} from '@shared/components/star-rating-bar/star-rating-bar.component';

@Component({
  selector: 'app-film-card',
  imports: [
    StarRatingBarComponent
  ],
  templateUrl: './film-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmCardComponent {
  readonly film = input.required<FilmDto>();
}
