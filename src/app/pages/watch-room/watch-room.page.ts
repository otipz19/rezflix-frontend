import {
  ChangeDetectionStrategy,
  Component,
  computed, DestroyRef,
  ElementRef,
  inject,
  OnInit,
  viewChild
} from '@angular/core';
import {WatchRoomService} from '../../core/watchroom/watch-room.service';
import {AuthService} from '../../core/auth/services/auth.service';
import {interval} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-watch-room',
  templateUrl: 'watch-room.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
})
export class WatchRoomPage implements OnInit {
  private readonly watchRoomService = inject(WatchRoomService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly auth = inject(AuthService);

  private readonly videoEl = viewChild.required<ElementRef<HTMLVideoElement>>('video');

  protected readonly $room = this.watchRoomService.room;
  protected readonly $roomId = this.watchRoomService.connectedRoomId;

  protected readonly isHost = computed(() => {
    return this.$room()?.hostUserId === this.auth.currentUser()?.info?.id;
  });

  ngOnInit() {
    if (this.isHost()) {
      interval(3000)
        .pipe(
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => this.sendSyncVideo());
    } else {
      this.watchRoomService.sync$
        .pipe(
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(state => {
          const videoEl = this.videoEl().nativeElement;
          if (state.isPaused) {
            videoEl.pause();
          } else {
            videoEl.play();
          }
          const stateTime = state.episodePositionMs / 1000;
          if (Math.abs(videoEl.currentTime - stateTime) > 0.2) {
            videoEl.currentTime = stateTime;
          }
        });
    }
  }

  protected onControlsChange(event: Event) {
    if (!this.isHost()) {
      event.preventDefault();
      return;
    }
    this.sendSyncVideo();
  }

  private sendSyncVideo() {
    const videoEl = this.videoEl().nativeElement;
    this.watchRoomService.sendSync({isPaused: videoEl.paused, episodePositionMs: videoEl.currentTime * 1000});
  }
}
