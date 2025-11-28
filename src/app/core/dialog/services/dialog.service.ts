import {EventEmitter, inject, Injectable} from '@angular/core';
import {ZardDialogOptions} from '@shared/zardui/components/dialog/dialog.component';
import {ZardDialogService} from '@shared/zardui/components/dialog/dialog.service';
import {catchError, EMPTY, filter, Observable, switchMap} from 'rxjs';
import {IUpsertDialogComponent} from '../abstract/upsert-dialog-component.interface';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private readonly zardDialogService = inject(ZardDialogService);

  create<TData extends object, TComponent extends IUpsertDialogComponent<TData>>(
    config: Omit<ZardDialogOptions<TComponent, TData>, 'zOnOk' | 'zOnCancel'>,
    submit$: (value: TData) => Observable<TData>
  ): Observable<TData> {
    return new Observable<TData>(subscriber => {
      const submitEvent = new EventEmitter<TComponent>();

      const dialogRef = this.zardDialogService.create<TComponent, TData>({
        ...config,
        zOnOk: submitEvent,
        zOnCancel: () => {
          subscriber.complete();
        }
      });

      submitEvent.subscribe(instance => {
        instance.validate$()
          .pipe(
            filter(valid => valid),
            switchMap(() => {
              const formValue = instance.getFormValue();
              return submit$(formValue)
            }),
            // Silent error handling to keep the dialog open on error
            catchError(() => EMPTY)
          )
          .subscribe(result => {
            subscriber.next(result);
            subscriber.complete();
          });
      })

      return () => {
        dialogRef.close();
      };
    });
  }
}
