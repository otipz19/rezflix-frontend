import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {FormInputComponent} from '@shared/forms/components/form-input/form-input.component';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ZardButtonComponent} from '@shared/zardui/components/button/button.component';
import {ZardCardComponent} from '@shared/zardui/components/card/card.component';
import {Router} from '@angular/router';
import {NotifyService} from '../../../../core/notify/services/notify.service';
import {ControlsOf} from '@shared/forms/utils/controls-of';
import {FilmControllerService, UpsertFilmDto} from '../../../../api';
import {checkValidFormSubmit$} from '@shared/forms/utils/check-valid-form-submit';
import {finalize, switchMap, tap} from 'rxjs';

@Component({
  selector: 'app-create-film',
  templateUrl: './create-film.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormInputComponent,
    FormsModule,
    ZardButtonComponent,
    ZardCardComponent,
    ReactiveFormsModule,
  ],
})
export class CreateFilmPage {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly router = inject(Router);
  private readonly notify = inject(NotifyService);
  private readonly api = inject(FilmControllerService);

  protected readonly requestInProgress = signal(false);

  protected readonly form = this.fb.group<ControlsOf<UpsertFilmDto>>({
    // TODO: check validators on backend
    title: this.fb.control('', [Validators.required]),
    description: this.fb.control('', [Validators.required]),
  });

  protected onSubmit() {
    checkValidFormSubmit$(this.form)
      .pipe(
        tap(() => this.requestInProgress.set(true)),
        switchMap(() => {
          const dto = this.form.getRawValue();
          return this.api.createFilm(dto);
        }),
        finalize(() => this.requestInProgress.set(false)),
        this.notify.notifyHttpRequest('Successfully created new movie!')
      )
      .subscribe(id => {
        this.router.navigate(['/', 'films', id]);
      });
  }
}
