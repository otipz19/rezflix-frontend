import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ZardButtonComponent} from '@shared/zardui/components/button/button.component';
import {ZardCardComponent} from '@shared/zardui/components/card/card.component';
import {Component, inject} from '@angular/core';
import {AuthService} from '../../../../auth/services/auth.service';
import {ControlsOf} from '@shared/forms/utils/controls-of';
import {LoginRequestDto} from '../../../../api';
import {checkValidFormSubmit$} from '@shared/forms/utils/check-valid-form-submit';
import {switchMap} from 'rxjs';
import {Router, RouterLink} from '@angular/router';
import {FormInputComponent} from '@shared/forms/components/form-input/form-input.component';
import {NotifyService} from '../../../../notify/services/notify.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ZardButtonComponent,
    ZardCardComponent,
    RouterLink,
    FormInputComponent,
  ],
  templateUrl: './login.page.html',
  host: {
    class: 'w-full max-w-md space-y-6 sm:space-y-8'
  }
})
export class LoginPage {
  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);
  private readonly notify = inject(NotifyService);

  protected readonly loginForm = this.fb.group<ControlsOf<LoginRequestDto>>({
    username: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
  });

  protected onSubmit() {
    checkValidFormSubmit$(this.loginForm)
      .pipe(
        switchMap(() => {
          const loginDto = this.loginForm.getRawValue();
          return this.auth.login$(loginDto);
        }),
        this.notify.notifyHttpRequest('Successfully logged in')
      )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }
}
