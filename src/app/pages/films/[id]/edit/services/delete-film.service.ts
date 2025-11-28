import {inject, Injectable} from '@angular/core';
import {Observable, switchMap} from 'rxjs';
import {DialogService} from '../../../../../core/dialog/services/dialog.service';
import {FilmControllerService, FilmDto} from '../../../../../api';
import {NotifyService} from '../../../../../core/notify/services/notify.service';

@Injectable({
  providedIn: 'root'
})
export class DeleteFilmService {
  private readonly dialogService = inject(DialogService);
  private readonly api = inject(FilmControllerService);
  private readonly notify = inject(NotifyService);

  delete$(id: FilmDto['id']): Observable<void> {
    return this.dialogService.confirm$({
      zContent: "Are you sure you want to delete this movie?",
      zOkDestructive: true,
      zOkText: "Delete"
    })
      .pipe(
        switchMap(() => {
          return this.api.deleteFilm(id)
        }),
        this.notify.notifyHttpRequest('Movie was deleted successfully!')
      );
  }
}
