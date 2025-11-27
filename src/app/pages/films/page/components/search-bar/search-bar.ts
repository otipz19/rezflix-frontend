import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bg-light-100/5 px-4 py-3 rounded-lg'
  }
})
export class SearchBar {

}
