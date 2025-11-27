import { ZardFormFieldComponent, ZardFormLabelComponent, ZardFormControlComponent } from '@shared/zardui/components/form/form.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ZardButtonComponent } from '@shared/zardui/components/button/button.component';
import { ZardInputDirective } from '@shared/zardui/components/input/input.directive';
import { ZardCardComponent } from '@shared/zardui/components/card/card.component';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ZardButtonComponent,
    ZardCardComponent,
    ZardInputDirective,
    ZardFormFieldComponent,
    ZardFormLabelComponent,
    ZardFormControlComponent,
  ],
  templateUrl: './login.page.html',
})
export class LoginPage {
  protected readonly isLoading = signal(false);

  protected readonly loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
}
