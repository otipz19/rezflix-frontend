import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth.layout.html',
  standalone: true,
  imports: [
    FormsModule,
    RouterOutlet
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthLayout {

}
