import { ChangeDetectionStrategy, Component } from '@angular/core';
import {ZardSkeletonComponent} from '@shared/zardui/components/skeleton/skeleton.component';

@Component({
  selector: 'app-film-card-skeleton',
  imports: [
    ZardSkeletonComponent
  ],
  templateUrl: './film-card-skeleton.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilmCardSkeletonComponent {

}
