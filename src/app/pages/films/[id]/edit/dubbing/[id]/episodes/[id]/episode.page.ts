import {ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {getFromRoute} from '@shared/routing/get-from-route';
import {EpisodeDto} from '../../../../../../../../api';
import {RESOLVE_EPISODE_KEY} from './episode.resolver';
import Player from 'video.js/dist/types/player';
import videojs from 'video.js';

@Component({
  selector: 'app-episode-page',
  templateUrl: 'episode.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class EpisodePage implements OnInit, OnDestroy {
  protected readonly episode = getFromRoute<EpisodeDto>(RESOLVE_EPISODE_KEY);

  @ViewChild('target', {static: true}) target!: ElementRef;

  private readonly options = {
    fluid: false,
    aspectRatio: '16:9',
    autoplay: false,
    sources: [{src: this.episode.hlsLink, type: 'application/vnd.apple.mpegurl'}]
  };

  private player?: Player;

  // Instantiate a Video.js player OnInit
  ngOnInit() {
    this.player = videojs(this.target.nativeElement, this.options, function onPlayerReady() {
      console.log('onPlayerReady', this);
    });
  }

  // Dispose the player OnDestroy
  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
}
