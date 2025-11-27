import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";
import {CUSTOM_VALIDATION_ERROR_KEY} from '@shared/forms/utils/get-validation-error-message';

export function passwordsEqualValidator(passwordControlName: string = 'password', passwordConfirmControlName: string = 'passwordConfirm'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get(passwordControlName);
    const passwordConfirm = control.get(passwordConfirmControlName);

    if (!password || !passwordConfirm || password.value !== passwordConfirm.value) {
      return {
        [CUSTOM_VALIDATION_ERROR_KEY.passwordsAreNotEqual]: {value: true}
      };
    }

    return null;
  };
}
