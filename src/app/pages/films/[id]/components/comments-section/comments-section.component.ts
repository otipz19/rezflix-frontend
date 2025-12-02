import {ChangeDetectionStrategy, Component, inject, input, OnInit, Signal} from '@angular/core';
import {CommentDto, FilmDto, UserRoleDto} from '../../../../../api';
import {CommentsStore} from '../../comments.store';
import {CommentFormComponent} from '../comment-form/comment-form.component';
import {AuthService} from '../../../../../core/auth/services/auth.service';
import {StarRatingBarComponent} from '@shared/components/star-rating-bar/star-rating-bar.component';
import {PaginatorComponent} from '@shared/components/paginator/paginator.component';
import {PaginationChangedEvent} from '@shared/components/paginator/pagination-changed-event';

@Component({
  selector: 'app-comments-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'comments-section.component.html',
  imports: [
    CommentFormComponent,
    StarRatingBarComponent,
    PaginatorComponent
  ],
  providers: [CommentsStore]
})
export class CommentsSectionComponent implements OnInit {
  private readonly store = inject(CommentsStore);
  protected readonly auth = inject(AuthService);

  readonly filmId = input.required<FilmDto['id']>();
  protected readonly pageIndex: Signal<number> = this.store.pageIndex;
  protected readonly pageSize: Signal<number> = this.store.pageSize;
  protected readonly total: Signal<number> = this.store.total;

  protected readonly comments: Signal<CommentDto[]> = this.store.comments;

  ngOnInit() {
    this.store.loadComments();
  }

  protected onCommentCreated() {
    this.store.loadComments();
  }

  protected onPageChanged(paginationEvent: PaginationChangedEvent) {
    this.store.loadPaginated(paginationEvent);
  }

  protected readonly UserRoleDto = UserRoleDto;
}
