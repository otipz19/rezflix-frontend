import {Observable} from 'rxjs';
import {inject} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {IUpsertDialogComponent} from './upsert-dialog-component.interface';
import {ControlsOf} from '@shared/forms/utils/controls-of';
import {validateFormSubmit$} from '@shared/forms/utils/check-valid-form-submit';
import {Z_MODAL_DATA} from '@shared/zardui/components/dialog/dialog.service';

export abstract class BaseUpsertDialogComponent<TFormValue extends object> implements IUpsertDialogComponent<TFormValue> {
  protected readonly zData: TFormValue = inject(Z_MODAL_DATA);
  protected readonly fb = inject(FormBuilder).nonNullable;

  protected readonly form = this.buildForm();

  protected abstract buildForm(): FormGroup<ControlsOf<TFormValue>>;

  constructor() {
    if (this.zData) {
      this.form.patchValue(this.zData);
    }
  }

  validate$(): Observable<boolean> {
    return validateFormSubmit$(this.form);
  }

  getFormValue(): TFormValue {
    return this.form.getRawValue() as TFormValue;
  }
}
