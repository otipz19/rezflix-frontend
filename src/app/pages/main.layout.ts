import {Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from '../auth/services/auth.service';
import {HeaderUserMenuComponent} from './components/header-user-menu/header-user-menu.component';
import {ZardButtonComponent} from '@shared/zardui/components/button/button.component';
import {UserRoleDto} from '../api';
import {ZardIconComponent} from '@shared/zardui/components/icon/icon.component';

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
}
