import {inject, Injectable} from '@angular/core';
import {Observable, switchMap} from 'rxjs';
import {DialogService} from '../../../../core/dialog/services/dialog.service';
import {EpisodeDto, FilmEpisodeControllerService} from '../../../../api';
import {NotifyService} from '../../../../core/notify/services/notify.service';

@Injectable({
  providedIn: 'root'
})
export class DeleteEpisodeService {
  private readonly dialogService = inject(DialogService);
  private readonly api = inject(FilmEpisodeControllerService);
  private readonly notify = inject(NotifyService);

  delete$(id: EpisodeDto['id']): Observable<void> {
    return this.dialogService.confirm$({
      zContent: "Are you sure you want to delete this episode?",
      zOkDestructive: true,
      zOkText: "Delete"
    })
      .pipe(
        switchMap(() => {
          return this.api.deleteEpisode(id)
        }),
        this.notify.notifyHttpRequest('Episode was deleted successfully!')
      );
  }
}
