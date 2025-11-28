import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ZardButtonComponent} from '@shared/zardui/components/button/button.component';
import {ZardCardComponent} from '@shared/zardui/components/card/card.component';
import {Component, inject} from '@angular/core';
import {checkValidFormSubmit$} from '@shared/forms/utils/check-valid-form-submit';
import {switchMap} from 'rxjs';
import {Router, RouterLink} from '@angular/router';
import {passwordsEqualValidator} from '@shared/forms/validators/passwords-equal.validator';
import {RegistrationService} from '../../../../core/auth/services/registration.service';
import {FormInputComponent} from '@shared/forms/components/form-input/form-input.component';
import {ErrorMessagePipe} from '@shared/forms/pipes/error-message.pipe';
import {ZardFormMessageComponent} from '@shared/zardui/components/form/form.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ZardButtonComponent,
    ZardCardComponent,
    RouterLink,
    FormInputComponent,
    ErrorMessagePipe,
    ZardFormMessageComponent,
  ],
  templateUrl: './registration.page.html',
  host: {
    class: 'w-full max-w-md space-y-6 sm:space-y-8'
  }
})
export class RegistrationPage {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly router = inject(Router);
  protected readonly registrationService = inject(RegistrationService);

  protected readonly form = this.fb.group({
    // TODO: check backend for length validation of username and password
    username: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
    passwordConfirm: this.fb.control("", [Validators.required]),
  }, {
    validators: [passwordsEqualValidator()]
  });

  protected onSubmit() {
    checkValidFormSubmit$(this.form)
      .pipe(
        switchMap(() => {
          const {username, password} = this.form.getRawValue();
          return this.registrationService.register$({username, password});
        })
      )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }
}
