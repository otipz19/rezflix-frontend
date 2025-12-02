import {ChangeDetectionStrategy, Component, input, inject} from '@angular/core';
import {UserDto, UserTypeDto, UserControllerService} from '../../../../../api';
import {DialogService} from '../../../../../core/dialog/services/dialog.service';
import {NotifyService} from '../../../../../core/notify/services/notify.service';
import {injectDispatch} from '@ngrx/signals/events';
import {superAdminPageEvents} from '../../state/events';
import {ZardButtonComponent} from '@shared/zardui/components/button/button.component';
import {ZardIconComponent} from '@shared/zardui/components/icon/icon.component';

@Component({
  selector: 'app-user-card',
  imports: [ZardButtonComponent, ZardIconComponent],
  templateUrl: './user-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardComponent {
  readonly user = input.required<UserDto>();
  protected readonly UserTypeDto = UserTypeDto;

  private readonly dialogService = inject(DialogService);
  private readonly api = inject(UserControllerService);
  private readonly notify = inject(NotifyService);
  private readonly dispatch = injectDispatch(superAdminPageEvents);

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

  protected onDelete() {
    this.dialogService.confirm$({
      zContent: 'Are you sure you want to delete this user?',
      zOkText: 'Delete',
      zOkDestructive: true
    }).subscribe(() => {
      const id = this.user().id;
      this.api.deleteUser(id)
        .pipe(this.notify.notifyHttpRequest('User was deleted'))
        .subscribe(() => {
          this.dispatch.opened();
        });
    });
  }
}
