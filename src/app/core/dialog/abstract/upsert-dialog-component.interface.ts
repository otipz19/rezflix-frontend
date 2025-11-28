import {Observable} from 'rxjs';

export interface IUpsertDialogComponent<TFormValue extends object> {
  validate$(): Observable<boolean>;

  getFormValue(): TFormValue;
}
