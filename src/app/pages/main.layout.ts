import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ZardDropdownModule} from '@shared/zardui/components/dropdown/dropdown.module';
import {ZardDividerComponent} from '@shared/zardui/components/divider/divider.component';
import {ZardButtonComponent} from '@shared/zardui/components/button/button.component';
import {ZardIconComponent} from '@shared/zardui/components/icon/icon.component';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main.layout.html',
  standalone: true,
  imports: [
    RouterOutlet,
    ZardDropdownModule,
    ZardDividerComponent,
    ZardButtonComponent,
    ZardIconComponent
  ]
})
export class MainLayout {

}
