import {ChangeDetectionStrategy, Component, effect, input, output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [
    FormsModule
  ],
  templateUrl: './search-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bg-light-100/5 px-4 py-3 rounded-lg'
  }
})
export class SearchBarComponent {
  readonly placeholder = input<string>('Search...');

  readonly queryChanged = output<string>();

  protected readonly query = signal('');

  constructor() {
    effect(() => {
      this.queryChanged.emit(this.query());
    });
  }
}
