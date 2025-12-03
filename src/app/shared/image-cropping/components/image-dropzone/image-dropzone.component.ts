import {Component, inject, output} from '@angular/core';
import {NgxFileDropEntry, NgxFileDropModule} from "ngx-file-drop";
import {concatMap} from 'rxjs';
import {DroppedFileValidationService} from '@shared/files/dropped-file-validation.service';
import {getFilesFromNgxFileDropEvent$} from '@shared/files/get-files-from-ngx-file-drop-event';
import {IMAGE_TYPES} from '@shared/files/file-type-utils';

@Component({
  selector: 'app-image-dropzone',
  imports: [
    NgxFileDropModule
  ],
  templateUrl: './image-dropzone.component.html',
})
export class ImageDropzoneComponent {
  private readonly fileValidation = inject(DroppedFileValidationService);

  protected readonly accept = IMAGE_TYPES.toString();

  protected readonly fileUpload = output<File>();

  protected onDrop(event: NgxFileDropEntry[]) {
    return getFilesFromNgxFileDropEvent$(event)
      .pipe(
        concatMap(file => this.fileValidation.validateImageFile$(file))
      )
      .subscribe(file => {
        this.fileUpload.emit(file);
      });
  }
}
