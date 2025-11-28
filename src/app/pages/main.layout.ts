import {Component, inject} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {AuthService} from '../auth/services/auth.service';
import {HeaderUserMenuComponent} from './components/header-user-menu/header-user-menu.component';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main.layout.html',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderUserMenuComponent,
    RouterLink
  ]
})
export class MainLayout {
  protected readonly auth = inject(AuthService);
}
