import {EventEmitter, inject, Injectable} from '@angular/core';
import {ZardDialogOptions} from '@shared/zardui/components/dialog/dialog.component';
import {ZardDialogService} from '@shared/zardui/components/dialog/dialog.service';
import {catchError, EMPTY, filter, Observable, switchMap} from 'rxjs';
import {IUpsertDialogComponent} from '../abstract/upsert-dialog-component.interface';

export type ConfirmDialogConfig = Pick<ZardDialogOptions<any, any>, 'zContent' | 'zOkText' | 'zCancelText' | 'zOkDestructive'>;

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private readonly zardDialogService = inject(ZardDialogService);

  confirm$(config: ConfirmDialogConfig): Observable<void> {
    return new Observable<void>(subscriber => {
      const dialogRef = this.zardDialogService.create({
        ...config,
        zTitle: 'Confirmation',
        zWidth: '425px',
        zOnOk: () => {
          subscriber.next();
          subscriber.complete();
        },
        zOnCancel: () => subscriber.complete()
      });

      return () => {
        dialogRef.close();
      };
    });
  }

  upsert$<TData extends object, TComponent extends IUpsertDialogComponent<TData>, TResult>(
    config: Omit<ZardDialogOptions<TComponent, TData>, 'zOnOk' | 'zOnCancel'>,
    submit$: (value: TData) => Observable<TResult>
  ): Observable<TResult> {
    return new Observable<TResult>(subscriber => {
      const submitEvent = new EventEmitter<TComponent>();

      const dialogRef = this.zardDialogService.create<TComponent, TData>({
        ...config,
        zWidth: config.zWidth ?? '425px',
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
          .subscribe(res => {
            subscriber.next(res);
            subscriber.complete();
          });
      })

      return () => {
        dialogRef.close();
      };
    });
  }
}
