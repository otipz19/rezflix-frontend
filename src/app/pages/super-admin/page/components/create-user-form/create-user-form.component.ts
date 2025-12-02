import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule, Validators, FormGroup} from '@angular/forms';
import {FormInputComponent} from '@shared/forms/components/form-input/form-input.component';
import {CreateUserDto, UserTypeDto} from '../../../../../api';
import {BaseUpsertDialogComponent} from '../../../../../core/dialog/abstract/base-upsert-dialog-component';
import {ControlsOf} from '@shared/forms/utils/controls-of';
import {passwordsEqualValidator} from '@shared/forms/validators/passwords-equal.validator';
import {ErrorMessagePipe} from '@shared/forms/pipes/error-message.pipe';
import {ZardFormMessageComponent} from '@shared/zardui/components/form/form.component';

type CreateUserFormValue = CreateUserDto & {passwordConfirm: string};

@Component({
  selector: 'app-create-user-form',
  templateUrl: './create-user-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormInputComponent, ZardFormMessageComponent, ErrorMessagePipe]
})
export class CreateUserFormComponent extends BaseUpsertDialogComponent<CreateUserFormValue> {
  protected readonly UserTypeDto = UserTypeDto;

  protected buildForm(): FormGroup<ControlsOf<CreateUserFormValue>> {
    const fb = this.fb;

    return fb.group<ControlsOf<CreateUserFormValue>>({
      username: fb.control('', [Validators.required]),
      password: fb.control('', [Validators.required]),
      passwordConfirm: fb.control('', [Validators.required]),
      type: fb.control<UserTypeDto>(UserTypeDto.VIEWER, [Validators.required]),
      about: fb.control('')
    }, {validators: [passwordsEqualValidator()]});
  }
}
