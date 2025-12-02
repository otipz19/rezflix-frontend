import {ChangeDetectionStrategy, Component, inject, input, OnInit, Signal} from '@angular/core';
import {CommentDto, FilmDto, UserRoleDto} from '../../../../../api';
import {CommentsStore} from '../../comments.store';
import {CommentFormComponent} from '../comment-form/comment-form.component';
import {AuthService} from '../../../../../core/auth/services/auth.service';
import {StarRatingBarComponent} from '@shared/components/star-rating-bar/star-rating-bar.component';

@Component({
  selector: 'app-comments-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'comments-section.component.html',
  imports: [
    CommentFormComponent,
    StarRatingBarComponent
  ],
  providers: [CommentsStore]
})
export class CommentsSectionComponent implements OnInit {
  private readonly store = inject(CommentsStore);
  protected readonly auth = inject(AuthService);

  readonly filmId = input.required<FilmDto['id']>();

  protected readonly comments: Signal<CommentDto[]> = this.store.comments;

  ngOnInit() {
    this.reload();
  }

  protected onCommentCreated() {
    this.reload();
  }

  private reload() {
    this.store.loadComments(this.filmId());
  }

  protected readonly UserRoleDto = UserRoleDto;
}
