import {ChangeDetectionStrategy, Component, computed, input} from '@angular/core';
import {ErrorMessagePipe} from '@shared/forms/pipes/error-message.pipe';
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  ZardFormControlComponent, ZardFormFieldComponent,
  ZardFormLabelComponent,
  ZardFormMessageComponent
} from '@shared/zardui/components/form/form.component';
import {ZardInputDirective} from '@shared/zardui/components/input/input.directive';

export type FormInputFieldType =
  | "email"
  | "number"
  | "tel"
  | "text"
  | "textarea"
  | "password";

@Component({
  selector: 'app-form-input',
  imports: [
    ErrorMessagePipe,
    FormsModule,
    ZardFormControlComponent,
    ZardFormLabelComponent,
    ZardFormMessageComponent,
    ZardInputDirective,
    ReactiveFormsModule,
    ZardFormFieldComponent
  ],
  templateUrl: './form-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  }
})
export class FormInputComponent {
  readonly control = input.required<FormControl>();
  readonly label = input.required<string>();

  readonly type = input<FormInputFieldType>('text');
  readonly placeholder = input<string>('');
  readonly rows = input<number>(5);

  protected readonly isRequired = computed(() => this.control().hasValidator(Validators.required));
}
