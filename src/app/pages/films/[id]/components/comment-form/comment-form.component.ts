import {ChangeDetectionStrategy, Component, inject, input, output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ControlsOf} from '@shared/forms/utils/controls-of';
import {FilmCommentControllerService, FilmDto, UpdateCommentDto} from '../../../../../api';
import {checkValidFormSubmit$} from '@shared/forms/utils/check-valid-form-submit';
import {switchMap} from 'rxjs';
import {NotifyService} from '../../../../../core/notify/services/notify.service';
import {FormInputComponent} from '@shared/forms/components/form-input/form-input.component';
import {ZardButtonComponent} from '@shared/zardui/components/button/button.component';

@Component({
  selector: 'app-comment-form',
  templateUrl: 'comment-form.component.html',
  imports: [
    ReactiveFormsModule,
    FormInputComponent,
    ZardButtonComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentFormComponent {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly api = inject(FilmCommentControllerService);
  private readonly notify = inject(NotifyService);

  readonly filmId = input.required<FilmDto['id']>();

  readonly createdComment = output<void>();

  protected readonly form = this.fb.group<ControlsOf<UpdateCommentDto>>({
    // TODO: check validators on backend
    text: this.fb.control('', [Validators.required])
  });

  protected onSubmit() {
    checkValidFormSubmit$(this.form)
      .pipe(
        switchMap(() => {
          const {text} = this.form.getRawValue();
          return this.api.createComment({filmId: this.filmId(), text});
        }),
        this.notify.notifyHttpRequest('Successfully posted a comment!')
      )
      .subscribe(() => {
        this.createdComment.emit();
        this.form.reset();
      });
  }
}
