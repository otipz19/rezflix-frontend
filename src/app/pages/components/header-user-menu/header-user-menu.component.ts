import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ZardDropdownModule} from '@shared/zardui/components/dropdown/dropdown.module';
import {ZardDividerComponent} from '@shared/zardui/components/divider/divider.component';
import {ZardButtonComponent} from '@shared/zardui/components/button/button.component';
import {ZardIconComponent} from '@shared/zardui/components/icon/icon.component';
import {AuthService} from '../../../core/auth/services/auth.service';
import {NotifyService} from '../../../core/notify/services/notify.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-header-user-menu',
  imports: [
    ZardDropdownModule,
    ZardDividerComponent,
    ZardButtonComponent,
    ZardIconComponent,
    RouterLink,
  ],
  templateUrl: './header-user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderUserMenuComponent {
  protected readonly auth = inject(AuthService);
  private readonly notify = inject(NotifyService);

  protected onLogout() {
    this.auth.logout();
    this.notify.showSuccessToast("Successfully logged out!");
  }
}
