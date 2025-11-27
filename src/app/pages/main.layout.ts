import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main.layout.html',
  standalone: true,
  imports: [
    RouterOutlet
  ]
})
export class MainLayout {

}
