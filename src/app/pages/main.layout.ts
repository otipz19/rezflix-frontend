import {Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {ZardDropdownModule} from '@shared/zardui/components/dropdown/dropdown.module';
import {ZardDividerComponent} from '@shared/zardui/components/divider/divider.component';
import {ZardButtonComponent} from '@shared/zardui/components/button/button.component';
import {ZardIconComponent} from '@shared/zardui/components/icon/icon.component';
import {AuthService} from '../auth/services/auth.service';
import {NotifyService} from '../notify/services/notify.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main.layout.html',
  standalone: true,
  imports: [
    RouterOutlet,
    ZardDropdownModule,
    ZardDividerComponent,
    ZardButtonComponent,
    ZardIconComponent,
    RouterLink
  ]
})
export class MainLayout {
  protected readonly auth = inject(AuthService);
  private readonly notify = inject(NotifyService);

  protected onLogout() {
    this.auth.logout();
    this.notify.showSuccessToast("Successfully logged out!");
  }
}
