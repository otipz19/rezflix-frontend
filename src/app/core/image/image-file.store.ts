import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, catchError, EMPTY, map, Observable, switchMap, tap} from 'rxjs';
import {FileControllerService, FileTypeDto, FilmDto, UserDto} from 'src/app/api';

@Injectable({
  providedIn: 'root'
})
export class ImageFileStore {
  private readonly filesApi = inject(FileControllerService);

  private readonly userPhotosSubjects = new Map<UserDto['id'], BehaviorSubject<File | undefined>>();
  private readonly filmPostersSubjects = new Map<FilmDto['id'], BehaviorSubject<File | undefined>>();

  getUserPhotoSubject$(userId: number): Observable<File | undefined> {
    return this.getPhotoSubject$(userId, FileTypeDto.USER_AVATAR, this.userPhotosSubjects);
  }

  getFilmPosterSubject$(filmId: number): Observable<File | undefined> {
    return this.getPhotoSubject$(filmId, FileTypeDto.FILM_POSTER, this.filmPostersSubjects);
  }

  private getPhotoSubject$(entityId: number, fileType: FileTypeDto, cache: Map<number, BehaviorSubject<File | undefined>>): Observable<File | undefined> {
    if (cache.has(entityId)) {
      return cache.get(entityId)!;
    }

    return this.filesApi.getEntitiesFilesInfo(fileType, [entityId])
      .pipe(
        switchMap(filesInfoList => {
          const filesIds = filesInfoList[0].filesIds;
          const subject = this.setNewSubject(cache, entityId);
          if (filesIds.length > 0) {
            this.getFileById$(filesIds[0])
              .pipe(
                catchError(() => EMPTY)
              )
              .subscribe(file => subject.next(file));
          }
          return subject;
        }),
        catchError(() => {
          return this.setNewSubject(cache, entityId);
        })
      );
  }

  loadNewUserPhoto(userId: number) {
    this.loadNewPhoto(userId, FileTypeDto.USER_AVATAR, this.userPhotosSubjects);
  }

  loadNewFilmPoster(filmId: number) {
    this.loadNewPhoto(filmId, FileTypeDto.FILM_POSTER, this.filmPostersSubjects);
  }

  private loadNewPhoto(entityId: number, fileType: FileTypeDto, cache: Map<number, BehaviorSubject<File | undefined>>): void {
    if (cache.has(entityId)) {
      const subject = cache.get(entityId)!;
      this.filesApi.getEntitiesFilesInfo(fileType, [entityId])
        .pipe(
          tap(filesInfoList => {
            const fileIds = filesInfoList[0].filesIds;
            if (fileIds.length === 0) {
              subject.next(undefined);
            } else {
              this.getFileById$(fileIds[0])
                .subscribe({
                  next: file => subject.next(file),
                  error: () => subject.next(undefined)
                });
            }
          }),
          catchError(() => {
            return this.setNewSubject(cache, entityId);
          })
        )
        .subscribe();
    }
  }

  private setNewSubject(cache: Map<number, BehaviorSubject<File | undefined>>, entityId: number) {
    const subject = new BehaviorSubject<File | undefined>(undefined);
    cache.set(entityId, subject);
    return subject;
  }

  private getFileById$(filesId: string) {
    return this.filesApi.getFile(filesId)
      .pipe(
        map(blob => blob as File),
      );
  }
}
