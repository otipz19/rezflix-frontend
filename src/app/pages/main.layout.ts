import {Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {ZardDropdownModule} from '@shared/zardui/components/dropdown/dropdown.module';
import {ZardDividerComponent} from '@shared/zardui/components/divider/divider.component';
import {ZardButtonComponent} from '@shared/zardui/components/button/button.component';
import {ZardIconComponent} from '@shared/zardui/components/icon/icon.component';
import {AuthService} from '../auth/services/auth.service';

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

  protected onLogout() {
    this.auth.logout();
  }
}
