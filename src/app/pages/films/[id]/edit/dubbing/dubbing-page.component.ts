import {ChangeDetectionStrategy, Component, inject, Signal} from '@angular/core';
import {DubbingDto, EpisodeDto} from '../../../../../api';
import {DubbingStore} from './dubbing.store';
import {ZardButtonComponent} from '@shared/zardui/components/button/button.component';
import {getFromRoute} from '@shared/routing/get-from-route';
import {RESOLVE_DUBBING_KEY} from './dubbing.resolver';

@Component({
  selector: 'app-dubbing-component',
  templateUrl: 'dubbing-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ZardButtonComponent
  ],
  providers: [DubbingStore]
})
export class DubbingPageComponent {
  private readonly store = inject(DubbingStore);

  protected readonly dubbing = this.store.dubbing;
  protected readonly episodes: Signal<EpisodeDto[]> = this.store.episodes;
  protected readonly isLoadingEpisodes: Signal<boolean> = this.store.isLoadingEpisodes;

  constructor() {
    this.store.useDubbing(getFromRoute<DubbingDto>(RESOLVE_DUBBING_KEY));
    this.store.loadEpisodes();
  }

  protected onAddNewEpisode() {

  }
}
