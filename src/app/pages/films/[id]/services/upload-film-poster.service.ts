import {inject, Injectable} from '@angular/core';
import {FileControllerService, FileTypeDto, FilmDto} from '../../../../api';
import {NotifyService} from '../../../../core/notify/services/notify.service';
import {Observable, of} from 'rxjs';
import {DialogService} from '../../../../core/dialog/services/dialog.service';
import {
  ImageDto,
  ImageUploadModalComponent
} from '@shared/image-cropping/components/image-upload-modal/image-upload-modal.component';

@Injectable({
  providedIn: 'root'
})
export class UploadFilmPosterService {
  private readonly api = inject(FileControllerService);
  private readonly notify = inject(NotifyService);
  private readonly dialogService = inject(DialogService);

  upload$(filmId: FilmDto['id']): Observable<string> {
    return this.dialogService.upsert$(
      {
        zTitle: 'Upload poster',
        zContent: ImageUploadModalComponent,
        zOkText: 'Save changes',
      },
      ({file}: ImageDto) => {
        if(!file) {
          return of();
        }
        return this.api.uploadFile(FileTypeDto.FILM_POSTER, filmId, file)
          .pipe(
            this.notify.notifyHttpRequest('Poster was uploaded successfully!')
          );
      }
    );
  }
}
