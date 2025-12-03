import { Injectable, inject } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { Subject, Subscription } from 'rxjs';

import { WatchRoomStateDto, WatchRoomDto, ChatMessageDto } from './watch-room.dto';
import { AuthService } from '../auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class WatchRoomService {
  private rxStomp: RxStomp | null = null;
  private readonly auth = inject(AuthService);

  private connectedRoomId?: string;

  private initSub?: Subscription;
  private syncSub?: Subscription;
  private chatSub?: Subscription;

  private initSubject = new Subject<WatchRoomDto>();
  private syncSubject = new Subject<WatchRoomStateDto>();
  private chatSubject = new Subject<ChatMessageDto>();
  private errorSubject = new Subject<string | null>();

  public readonly init$ = this.initSubject.asObservable();
  public readonly sync$ = this.syncSubject.asObservable();
  public readonly chat$ = this.chatSubject.asObservable();
  public readonly error$ = this.errorSubject.asObservable();

  connect(roomId: string, roomPassword: string | undefined = undefined, wsUrl = 'ws://localhost:8080/watch-room-ws') {
    if (this.rxStomp) {
      this.disconnect();
    }

    const token = this.auth.accessToken;

    const rx = new RxStomp();
    rx.configure({
      webSocketFactory: () => new WebSocket(wsUrl),
      connectHeaders: {
        Authentication: token ? `Bearer ${token}` : '',
        'Room-Id': roomId,
        'Room-Password': roomPassword ?? '',
      },
      reconnectDelay: 0,
    });
    rx.activate();

    this.rxStomp = rx;
    this.connectedRoomId = roomId;

    const originalOnStompError = rx.stompClient.onStompError;
    rx.stompClient.onStompError = (frame: any) => {
      if (originalOnStompError) originalOnStompError(frame);
      const hdrMsg = frame.headers?.message ?? null;
      this.errorSubject.next(hdrMsg);
    };

    this.initSub = rx.watch(`/rezflix/watch-room/${roomId}/init`).subscribe((msg) => {
      try {
        const dto = JSON.parse(msg.body) as WatchRoomDto;
        this.initSubject.next(dto);
      } catch (e) {
        console.error('Failed to parse init message', e);
      }
    });

    this.syncSub = rx.watch(`/topic/watch-room/${roomId}/sync`).subscribe((msg) => {
      try {
        const dto = JSON.parse(msg.body) as WatchRoomStateDto;
        this.syncSubject.next(dto);
      } catch (e) {
        console.error('Failed to parse sync message', e);
      }
    });

    this.chatSub = rx.watch(`/topic/watch-room/${roomId}/chat`).subscribe((msg) => {
      try {
        const dto = JSON.parse(msg.body) as ChatMessageDto;
        this.chatSubject.next(dto);
      } catch (e) {
        console.error('Failed to parse chat message', e);
      }
    });
  }

  disconnect() {
    this.initSub?.unsubscribe();
    this.syncSub?.unsubscribe();
    this.chatSub?.unsubscribe();
    if (this.rxStomp) {
      try {
        this.rxStomp.deactivate();
      } catch (e) {
        // ignore
      }
    }
    this.rxStomp = null;
    this.connectedRoomId = undefined;
  }

  sendSync(stateDto: WatchRoomStateDto) {
    if (!this.rxStomp) throw new Error('WatchRoomService: not connected');
    this.rxStomp.publish({
      destination: `/rezflix/watch-room/${this.connectedRoomId}/sync`,
      body: JSON.stringify(stateDto),
      headers: { 'content-type': 'application/json' },
    });
  }

  sendChat(message: string) {
    if (!this.rxStomp) throw new Error('WatchRoomService: not connected');
    this.rxStomp.publish({
      destination: `/rezflix/watch-room/${this.connectedRoomId}/chat`,
      body: message,
      headers: { 'content-type': 'text/plain' },
    });
  }

  registerInitCallback(cb: (dto: WatchRoomDto) => void) {
    return this.init$.subscribe(cb);
  }

  registerSyncCallback(cb: (dto: WatchRoomStateDto) => void) {
    return this.sync$.subscribe(cb);
  }

  registerChatCallback(cb: (dto: ChatMessageDto) => void) {
    return this.chat$.subscribe(cb);
  }

  registerErrorCallback(cb: (err: string | null) => void) {
    return this.error$.subscribe(cb);
  }
}
