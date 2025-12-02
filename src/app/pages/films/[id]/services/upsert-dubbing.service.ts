import {inject, Injectable} from '@angular/core';
import {DialogService} from '../../../../core/dialog/services/dialog.service';
import {
  DubbingDto,
  FilmDto, FilmDubbingControllerService, UpdateDubbingDto,
} from '../../../../api';
import {NotifyService} from '../../../../core/notify/services/notify.service';
import {Observable} from 'rxjs';
import {UpsertDubbingFormComponent} from '../components/upsert-dubbing-form/upsert-dubbing-form.component';

@Injectable({
  providedIn: 'root'
})
export class UpsertDubbingService {
  private readonly dialogService = inject(DialogService);
  private readonly api = inject(FilmDubbingControllerService);
  private readonly notify = inject(NotifyService);

  create$(filmId: FilmDto['id']): Observable<DubbingDto['id']> {
    return this.dialogService.upsert$(
      {
        zTitle: 'Create dubbing',
        zContent: UpsertDubbingFormComponent,
        zOkText: 'Save changes',
      },
      (dto: UpdateDubbingDto) => {
        return this.api.createDubbing({filmId, ...dto})
          .pipe(
            this.notify.notifyHttpRequest('Dubbing was created successfully!')
          );
      }
    );
  }
}
