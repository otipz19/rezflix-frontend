import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {DubbingDto, EpisodeDto, FilmEpisodeControllerService} from '../../../../../api';
import {DialogService} from '../../../../../core/dialog/services/dialog.service';
import {NotifyService} from '../../../../../core/notify/services/notify.service';
import {
  CreateEpisodeDto,
  CreateEpisodeFormComponent
} from '../components/create-episode-form/create-episode-form.component';

@Injectable({
  providedIn: 'root'
})
export class UpsertEpisodeService {
  private readonly dialogService = inject(DialogService);
  private readonly api = inject(FilmEpisodeControllerService);
  private readonly notify = inject(NotifyService);

  create$(dubbingId: DubbingDto['id'], lastWatchOrder: number): Observable<EpisodeDto['id']> {
    return this.dialogService.upsert$(
      {
        zTitle: 'Create Episode',
        zContent: CreateEpisodeFormComponent,
        zOkText: 'Save changes',
      },
      ({title, file}: CreateEpisodeDto) => {
        return this.api.createEpisode(dubbingId, {title, watchOrder: lastWatchOrder + 1}, {file})
          .pipe(
            this.notify.notifyHttpRequest('Episode was created successfully!')
          );
      }
    );
  }
}
