import {inject, Injectable} from '@angular/core';
import {EMPTY, Observable, of, switchMap} from 'rxjs';
import {NotifyService} from '../../core/notify/services/notify.service';
import {IMAGE_TYPES, MAX_FILE_SIZE, VIDEO_TYPES} from '@shared/files/file-type-utils';

@Injectable({
  providedIn: 'root'
})
export class DroppedFileValidationService {
  private readonly notify = inject(NotifyService);

  validateEpisodeFile$(file: File): Observable<File> {
    return this.validate$(file, VIDEO_TYPES);
  }

  validateImageFile$(file: File): Observable<File> {
    return this.validate$(file, IMAGE_TYPES);
  }

  private validate$(file: File, fileTypes: readonly string[]): Observable<File> {
    return of(file)
      .pipe(
        switchMap(file => {
          if(this.isFileSizeTooBig(file)) {
            this.showFileSizeErrorMessage();
            return EMPTY;
          }

          if (this.isFileTypeNotAllowed(file, fileTypes)) {
            this.showFileTypeErrorMessage(fileTypes);
            return EMPTY;
          }

          return of(file);
        })
      );
  }

  private isFileSizeTooBig(file: File) {
    return file.size > MAX_FILE_SIZE;
  }

  private showFileSizeErrorMessage() {
    this.notify.showErrorToast('File is too big: ' + MAX_FILE_SIZE);
  }

  private isFileTypeNotAllowed(file: File, fileTypes: readonly string[]) {
    return !fileTypes.includes(file.type);
  }

  private showFileTypeErrorMessage(fileTypes: readonly string[]) {
    this.notify.showErrorToast('Unsupported file type. Please, provide one of: ' + fileTypes);
  }
}
