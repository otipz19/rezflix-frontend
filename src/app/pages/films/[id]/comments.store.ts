import {computed, inject, Injectable, signal} from '@angular/core';
import {CommentDto, FilmCommentControllerService} from '../../../api';
import {NotifyService} from '../../../core/notify/services/notify.service';
import {finalize} from 'rxjs';
import {FilmStore} from './film.store';
import {PaginationChangedEvent} from '@shared/components/paginator/pagination-changed-event';

@Injectable()
export class CommentsStore {
  private readonly api = inject(FilmCommentControllerService);
  private readonly notify = inject(NotifyService);
  private readonly filmStore = inject(FilmStore);

  private readonly filmId = computed(() => this.filmStore.film().id);

  private readonly _comments = signal<CommentDto[]>([]);
  readonly comments = this._comments.asReadonly();

  private readonly _total = signal(0);
  readonly total = this._total.asReadonly();

  private readonly _pageSize = signal(5);
  readonly pageSize = this._pageSize.asReadonly();

  private readonly _pageIndex = signal(0);
  readonly pageIndex = this._pageIndex.asReadonly();

  private readonly _isLoading = signal(false);
  readonly isLoading = this._isLoading.asReadonly();

  loadComments() {
    this._isLoading.set(true);

    this.api.getCommentsByCriteria({
      filmId: this.filmId(),
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

  loadPaginated({pageSize, pageIndex}: PaginationChangedEvent) {
    this._pageSize.set(pageSize);
    this._pageIndex.set(pageIndex);
    this.loadComments();
  }
}
