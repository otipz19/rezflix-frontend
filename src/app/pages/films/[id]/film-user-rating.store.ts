import {inject, Injectable, signal} from '@angular/core';
import {FilmDto, FilmRatingControllerService, UserRoleDto} from '../../../api';
import {AuthService} from '../../../core/auth/services/auth.service';
import {NotifyService} from '../../../core/notify/services/notify.service';
import {tap} from 'rxjs';

@Injectable()
export class FilmUserRatingStore {
  private readonly ratingApi = inject(FilmRatingControllerService);
  private readonly auth = inject(AuthService);
  private readonly notify = inject(NotifyService);

  private readonly _userRating = signal<number>(0);
  readonly userRating = this._userRating.asReadonly();

  loadUserRating(filmId: FilmDto['id'], rating: number | undefined = undefined) {
    const user = this.auth.currentUser();
    if (!user || user.role !== UserRoleDto.VIEWER) {
      return;
    }

    if(rating) {
      this._userRating.set(rating);
    }
    const oldVal = this.userRating();

    this.ratingApi.getUserRating(filmId)
      .pipe(
        tap({
          next: ({rating}) => this._userRating.set(rating),
          error: () => this._userRating.set(oldVal),
        }),
        this.notify.notifyHttpError()
      )
      .subscribe();
  }
}
