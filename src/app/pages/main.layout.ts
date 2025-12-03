import {Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet, Router} from '@angular/router';
import {AuthService} from '../core/auth/services/auth.service';
import {HeaderUserMenuComponent} from './components/header-user-menu/header-user-menu.component';
import {ZardButtonComponent} from '@shared/zardui/components/button/button.component';
import {UserRoleDto} from '../api';
import {ZardIconComponent} from '@shared/zardui/components/icon/icon.component';
import {DialogService} from '../core/dialog/services/dialog.service';
import {ConnectWatchRoomFormComponent, ConnectWatchRoomFormValue} from './components/connect-watchroom-form/connect-watchroom-form.component';
import {WatchRoomService} from '../core/watchroom/watch-room.service';
import {NotifyService} from '../core/notify/services/notify.service';
import { take, of } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main.layout.html',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderUserMenuComponent,
    RouterLink,
    ZardButtonComponent,
    ZardIconComponent
  ]
})
export class MainLayout {
  protected readonly auth = inject(AuthService);
  protected readonly UserRoleDto = UserRoleDto;
  private readonly dialogService = inject(DialogService);
  private readonly watchRoomService = inject(WatchRoomService);
  private readonly notify = inject(NotifyService);
  private readonly router = inject(Router);

  protected onOpenConnectRoom() {
    this.dialogService.upsert$(
      {
        zContent: ConnectWatchRoomFormComponent,
        zTitle: 'Join watch room',
        zOkText: 'Connect',
      },
      (value: ConnectWatchRoomFormValue) => {
        return of(value)
      }
    ).subscribe((value : ConnectWatchRoomFormValue) => {
        try {
        this.watchRoomService.connect(value.roomId, value.password);
        this.watchRoomService.error$.pipe(take(1)).subscribe(err => {
          this.notify.showErrorToast(err ?? undefined);
        });
        this.watchRoomService.init$.pipe(take(1)).subscribe(room => {
          this.router.navigate(['/watch-room']);
        });
      } catch (e) {
        this.notify.showErrorToast();
      }
    });
  }
}