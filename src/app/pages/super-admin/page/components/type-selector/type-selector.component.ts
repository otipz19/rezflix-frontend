import {ChangeDetectionStrategy, Component, effect, output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {UserTypeDto} from '../../../../../api';

@Component({
  selector: 'app-type-selector',
  imports: [FormsModule],
  templateUrl: './type-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'px-3 py-5 rounded-lg bg-card text-card-foreground'
  }
})
export class TypeSelectorComponent {
  readonly typeChanged = output<UserTypeDto | null>();

  protected readonly selected = signal('');
  protected readonly UserTypeDto = UserTypeDto;

  constructor() {
    effect(() => {
      const value = this.selected();
      this.typeChanged.emit(value ? (value as UserTypeDto) : null);
    });
  }
}
