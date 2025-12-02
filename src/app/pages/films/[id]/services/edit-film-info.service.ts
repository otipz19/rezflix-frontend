import {inject, Injectable} from '@angular/core';
import {map, Observable} from 'rxjs';
import {DialogService} from '../../../../core/dialog/services/dialog.service';
import {EditFilmInfoFormComponent} from '../components/edit-film-info-form/edit-film-info-form.component';
import {FilmControllerService, FilmDto, UpsertFilmDto} from '../../../../api';
import {NotifyService} from '../../../../core/notify/services/notify.service';

@Injectable({
  providedIn: 'root'
})
export class EditFilmInfoService {
  private readonly dialogService = inject(DialogService);
  private readonly api = inject(FilmControllerService);
  private readonly notify = inject(NotifyService);

  edit$(id: FilmDto['id'], initialDto: UpsertFilmDto): Observable<UpsertFilmDto> {
    return this.dialogService.upsert$(
      {
        zTitle: 'Edit Movie Info',
        zDescription: `Make changes to movie info here. Click save when you're done.`,
        zContent: EditFilmInfoFormComponent,
        zData: initialDto,
        zOkText: 'Save changes',
      },
      (updatedFilm: UpsertFilmDto) => {
        return this.api.updateFilm(id, updatedFilm)
          .pipe(
            map(() => updatedFilm),
            this.notify.notifyHttpRequest('Movie info updated successfully!')
          );
      }
    );
  }
}
