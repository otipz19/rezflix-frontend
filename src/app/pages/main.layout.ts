import {Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from '../core/auth/services/auth.service';
import {HeaderUserMenuComponent} from './components/header-user-menu/header-user-menu.component';
import {ZardButtonComponent} from '@shared/zardui/components/button/button.component';
import {UserRoleDto} from '../api';
import {ZardIconComponent} from '@shared/zardui/components/icon/icon.component';
import {DialogService} from '../core/dialog/services/dialog.service';
import {
  ConnectWatchRoomFormComponent,
  ConnectWatchRoomFormValue
} from './components/connect-watchroom-form/connect-watchroom-form.component';
import {WatchRoomService} from '../core/watchroom/watch-room.service';
import {of} from 'rxjs';

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
    ).subscribe(value => this.watchRoomService.connectWithNavigation(value));
  }
}
