import {ChangeDetectionStrategy, Component} from '@angular/core';
import {getFromRoute} from '@shared/routing/get-from-route';
import {EpisodeDto} from '../../../../../../../../api';
import {RESOLVE_EPISODE_KEY} from './episode.resolver';
import {VideoPlayerComponent} from './components/video-player/video-player.component';

@Component({
  selector: 'app-episode-page',
  templateUrl: 'episode.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    VideoPlayerComponent
  ],
})
export class EpisodePage {
  protected readonly episode = getFromRoute<EpisodeDto>(RESOLVE_EPISODE_KEY);
  protected readonly episodeLink = 'http://localhost:8080' + this.episode.hlsLink;
}
