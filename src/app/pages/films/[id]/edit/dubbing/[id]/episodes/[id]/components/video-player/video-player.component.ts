import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  OnDestroy,
  OnInit, Signal,
  ViewChild
} from '@angular/core';
import Player from 'video.js/dist/types/player';
import videojs from 'video.js';

type VideoPlayerOptions = {
  fluid: boolean,
  aspectRatio: string,
  autoplay: boolean,
  sources: [{src: string, type: string}]
};

@Component({
  selector: 'app-video-player',
  templateUrl: 'video-player.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  readonly source = input.required<string>();

  private readonly options: Signal<VideoPlayerOptions> = computed(() => ({
    fluid: false,
    aspectRatio: '16:9',
    autoplay: false,
    sources: [{src: this.source(), type: 'application/vnd.apple.mpegurl'}]
  }));

  @ViewChild('target', {static: true}) target!: ElementRef;
  private player?: Player;

  ngOnInit() {
    this.player = videojs(this.target.nativeElement, this.options(), function onPlayerReady() {
    });
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }
}
