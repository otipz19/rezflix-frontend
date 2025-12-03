import {BaseImageFileLoaderDirective} from './base-image-file-loader.directive';
import {Directive, input} from '@angular/core';
import {Observable} from 'rxjs';
import {FilmDto} from '../../../api';

@Directive({
  selector: 'img[filmPosterLoader]',
  standalone: true,
})
export class FilmPosterLoaderDirective extends BaseImageFileLoaderDirective {
  readonly filmId = input.required<FilmDto['id']>();

  protected override getPhotoSubject$(): Observable<File | undefined> {
    return this.photosStore.getFilmPosterSubject$(this.filmId());
  }

  protected override getDefaultImgSrc(): string {
    return '/no-film-poster-vertical.png';
  }
}
