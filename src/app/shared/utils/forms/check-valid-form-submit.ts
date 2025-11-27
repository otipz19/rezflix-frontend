import {FormGroup} from '@angular/forms';
import {EMPTY, Observable, of, switchMap} from 'rxjs';
import {voidOperator} from '@shared/utils/void-operator';

export function checkValidFormSubmit$(...forms: FormGroup<any>[]): Observable<void> {
  return validateFormSubmit$(...forms)
    .pipe(
      switchMap(valid => valid ? of(true) : EMPTY),
      voidOperator()
    );
}

export function validateFormSubmit$(...forms: FormGroup<any>[]): Observable<boolean> {
  let invalid = false;

  for(const form of forms) {
    if(form.invalid) {
      form.markAllAsTouched();
      invalid = true;
    }
  }

  if(invalid) {
    return of(false);
  }

  return of(true);
}
