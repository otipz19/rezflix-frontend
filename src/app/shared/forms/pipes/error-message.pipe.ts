import {Pipe, PipeTransform} from "@angular/core";
import {ValidationErrors} from "@angular/forms";
import {getValidationErrorMessage} from '@shared/forms/utils/get-validation-error-message';

@Pipe({
  name: 'errorMessage',
  standalone: true
})
export class ErrorMessagePipe implements PipeTransform {
    transform(value: ValidationErrors | null): string {
        return getValidationErrorMessage(value);
    }
}
