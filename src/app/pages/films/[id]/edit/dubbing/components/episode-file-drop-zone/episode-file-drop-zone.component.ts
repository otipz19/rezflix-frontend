import {Component, effect, inject, input, output, signal} from '@angular/core';
import {NgxFileDropEntry, NgxFileDropModule} from "ngx-file-drop";
import {concatMap} from 'rxjs';
import {VIDEO_ICON_SRC, VIDEO_TYPES} from '@shared/files/file-type-utils';
import {getFilesFromNgxFileDropEvent$} from '@shared/files/get-files-from-ngx-file-drop-event';
import { DroppedFileValidationService } from '@shared/files/dropped-file-validation.service';

@Component({
  selector: 'app-episode-file-drop-zone',
  imports: [
    NgxFileDropModule
  ],
  templateUrl: './episode-file-drop-zone.component.html'
})
export class EpisodeFileDropZoneComponent {
  private readonly fileValidation = inject(DroppedFileValidationService);

  readonly initialFile = input<File | undefined>(undefined);
  readonly fileUpdate = output<File | undefined>();

  protected readonly $imageSrc = signal<string | ArrayBuffer | null>(null);

  protected readonly accept = VIDEO_TYPES.toString();

  constructor() {
    effect(() => {
      const initialFile = this.initialFile();
      if (initialFile) {
        this.$imageSrc.set(VIDEO_ICON_SRC);
      }
    });
  }

  protected onDrop(event: NgxFileDropEntry[]) {
    return getFilesFromNgxFileDropEvent$(event)
      .pipe(
        concatMap(file => this.fileValidation.validateEpisodeFile$(file))
      )
      .subscribe(file => {
        this.$imageSrc.set(VIDEO_ICON_SRC);
        this.fileUpdate.emit(file);
      });
  }

  protected onRemove(event: MouseEvent) {
    event.stopPropagation();
    this.$imageSrc.set(null);
    this.fileUpdate.emit(undefined);
  }
}
