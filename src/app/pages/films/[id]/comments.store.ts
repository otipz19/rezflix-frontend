import {inject, Injectable, signal} from '@angular/core';
import {CommentDto, FilmCommentControllerService, FilmDto} from '../../../api';
import {NotifyService} from '../../../core/notify/services/notify.service';
import {finalize} from 'rxjs';

@Injectable()
export class CommentsStore {
  private readonly api = inject(FilmCommentControllerService);
  private readonly notify = inject(NotifyService);

  private readonly _comments = signal<CommentDto[]>([]);
  readonly comments = this._comments.asReadonly();

  private readonly _total = signal(0);
  readonly total = this._total.asReadonly();

  private readonly _pageSize = signal(8);
  readonly pageSize = this._pageSize.asReadonly();

  private readonly _pageIndex = signal(0);
  readonly pageIndex = this._pageIndex.asReadonly();

  private readonly _isLoading = signal(false);
  readonly isLoading = this._isLoading.asReadonly();

  loadComments(filmId: FilmDto['id']) {
    this._isLoading.set(true);

    this.api.getCommentsByCriteria({
      filmId,
      orderBy: 'createdAt',
      isDescendingOrder: true,
      page: this.pageIndex(),
      size: this.pageSize()
    })
      .pipe(
        finalize(() => this._isLoading.set(false)),
        this.notify.notifyHttpError()
      )
      .subscribe(({items, total}) => {
        this._comments.set(items);
        this._total.set(total);
      });
  }
}
