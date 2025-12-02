import {inject, Injectable} from '@angular/core';
import {FilmDto, FilmRatingControllerService, UserRoleDto} from '../../../../api';
import {AuthService} from '../../../../core/auth/services/auth.service';
import {NotifyService} from '../../../../core/notify/services/notify.service';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilmUserRatingService {
  private readonly ratingApi = inject(FilmRatingControllerService);
  private readonly auth = inject(AuthService);
  private readonly notify = inject(NotifyService);

  setUserRating$(filmId: FilmDto['id'], rating: number): Observable<void> {
    const user = this.auth.currentUser();
    if (!user || user.role !== UserRoleDto.VIEWER) {
      of();
    }

    return this.ratingApi.setUserRating(filmId, {rating})
      .pipe(
        this.notify.notifyHttpRequest('Rating was changed successfully!')
      );
  }
}
