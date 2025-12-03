import {
  ChangeDetectionStrategy,
  Component,
  computed, DestroyRef,
  ElementRef,
  inject,
  OnInit, signal,
  viewChild
} from '@angular/core';
import {WatchRoomService} from '../../core/watchroom/watch-room.service';
import {AuthService} from '../../core/auth/services/auth.service';
import {interval} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ChatMessageDto} from '../../core/watchroom/watch-room.dto';
import {FormsModule} from '@angular/forms';
import {ZardFormControlComponent} from '@shared/zardui/components/form/form.component';
import {ZardInputDirective} from '@shared/zardui/components/input/input.directive';
import {ZardButtonComponent} from '@shared/zardui/components/button/button.component';
import {environment} from '../../../environments/environment';
import { ClipboardModule } from '@angular/cdk/clipboard';
import {NotifyService} from '../../core/notify/services/notify.service';

@Component({
  selector: 'app-watch-room',
  templateUrl: 'watch-room.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ZardFormControlComponent,
    ZardInputDirective,
    ZardButtonComponent,
    ClipboardModule
  ],
})
export class WatchRoomPage implements OnInit {
  private readonly watchRoomService = inject(WatchRoomService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly auth = inject(AuthService);
  private readonly notify = inject(NotifyService);
  protected readonly baseUrl = environment.basePath;

  private readonly videoEl = viewChild.required<ElementRef<HTMLVideoElement>>('video');

  protected readonly $room = this.watchRoomService.room;
  protected readonly $roomId = this.watchRoomService.connectedRoomId;

  protected readonly isHost = computed(() => {
    return this.$room()?.hostUserId === this.auth.currentUser()?.info?.id;
  });

  protected readonly chat = signal<ChatMessageDto[]>([]);
  protected readonly chatField = signal<string>('');

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
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe(state => {
          const videoEl = this.videoEl().nativeElement;
          const stateTime = state.episodePositionMs / 1000;
          if (state.paused) {
            videoEl.currentTime = stateTime;
            videoEl.pause();
          } else {
            if (Math.abs(videoEl.currentTime - stateTime) > 0.2) {
              videoEl.currentTime = stateTime;
            }

            try {
              videoEl.play().then(() => console.log('Played')).catch(() => {
                // Ignore errors
              });
            } catch {
              // Ignore errors
            }
          }
        });
    }

    this.watchRoomService.chat$
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(newMessage => {
        this.addNewMessage(newMessage);
      });

    this.destroyRef.onDestroy(() => {
      this.watchRoomService.disconnect()
    });
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
    this.watchRoomService.sendSync({paused: videoEl.paused, episodePositionMs: videoEl.currentTime * 1000});
  }

  protected onSendMessage() {
    this.watchRoomService.sendChat(this.chatField());
    this.chatField.set('');
  }

  private addNewMessage(dto: ChatMessageDto) {
    this.chat.update(old => {
      const next = [...old];
      next.push(dto);
      return next;
    });

    setTimeout(() => {
      document.querySelector('[data-last="true"]')?.scrollIntoView();
    });
  }

  protected onCopiedRoomId() {
    this.notify.showSuccessToast('Copied room id!');
  }
}
