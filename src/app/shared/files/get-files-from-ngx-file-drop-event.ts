import {NgxFileDropEntry} from 'ngx-file-drop';
import {bindCallback, concatMap, EMPTY, map, Observable} from 'rxjs';
import {fromArrayLike} from 'rxjs/internal/observable/innerFrom';

export function getFilesFromNgxFileDropEvent$(event: NgxFileDropEntry[]): Observable<File> {
  return fromArrayLike(event)
    .pipe(
      map(entry => entry.fileEntry),
      concatMap(fileEntry => {
        if (!fileEntry.isFile) {
          return EMPTY;
        }

        const getFile = bindCallback((callback: (file: File) => void) => {
          (fileEntry as FileSystemFileEntry).file(file => callback(file));
        });

        return getFile();
      })
    );
}
