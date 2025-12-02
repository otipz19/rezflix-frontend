import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {UserDto, UserTypeDto} from '../../../../../api';

@Component({
  selector: 'app-user-card',
  imports: [],
  templateUrl: './user-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardComponent {
  readonly user = input.required<UserDto>();
  protected readonly UserTypeDto = UserTypeDto;

  protected typeLabel(type?: UserTypeDto) {
    switch (type) {
      case UserTypeDto.CONTENT_MANAGER:
        return 'Content manager';
      case UserTypeDto.VIEWER:
        return 'Viewer';
      case UserTypeDto.MODERATOR:
        return 'Moderator';
      default:
        return '';
    }
  }
}
