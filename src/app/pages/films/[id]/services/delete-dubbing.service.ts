import {inject, Injectable} from '@angular/core';
import {Observable, switchMap} from 'rxjs';
import {DialogService} from '../../../../core/dialog/services/dialog.service';
import {DubbingDto, FilmDubbingControllerService} from '../../../../api';
import {NotifyService} from '../../../../core/notify/services/notify.service';

@Injectable({
  providedIn: 'root'
})
export class DeleteDubbingService {
  private readonly dialogService = inject(DialogService);
  private readonly api = inject(FilmDubbingControllerService);
  private readonly notify = inject(NotifyService);

  delete$(id: DubbingDto['id']): Observable<void> {
    return this.dialogService.confirm$({
      zContent: "Are you sure you want to delete this dubbing?",
      zOkDestructive: true,
      zOkText: "Delete"
    })
      .pipe(
        switchMap(() => {
          return this.api.deleteDubbing(id)
        }),
        this.notify.notifyHttpRequest('Dubbing was deleted successfully!')
      );
  }
}
