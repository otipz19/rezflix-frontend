import {inject, Injectable} from "@angular/core";
import {catchError, EMPTY, Observable, tap} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {toast} from 'ngx-sonner';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  private readonly router = inject(Router);

  notifyHttpRequest<T>(successMessage?: string): (innerObservable: Observable<T>) => Observable<T> {
    return (innerObservable: Observable<T>) => {
      return innerObservable
        .pipe(
          this.notifySuccess(successMessage),
          this.notifyHttpError()
        );
    };
  }

  notifySuccess<T>(successMessage?: string): (innerObservable: Observable<T>) => Observable<T> {
    return (innerObservable: Observable<T>) => {
      return innerObservable
        .pipe(
          tap(() => this.showSuccessToast(successMessage))
        )
    };
  }

  /**
   * Completes instead of throwing error
   */
  notifyHttpError<T>(): (innerObservable: Observable<T>) => Observable<T> {
    return (innerObservable: Observable<T>) => {
      return innerObservable
        .pipe(
          catchError(error => {
            if (error && error instanceof HttpErrorResponse && error.status === 401) {
              this.showErrorToast("Authentication failed");
              this.router.navigate(['/', 'auth', 'login']);
            } else {
              if(typeof error === 'string') {
                this.showErrorToast(error);
              } else if (error && error.message) {
                this.showErrorToast(error.message);
              } else {
                this.showErrorToast();
              }
            }
            return EMPTY;
          })
        )
    };
  }

  /**
   * Completes instead of throwing error
   */
  notifyError<T>(errorMessage?: string): (innerObservable: Observable<T>) => Observable<T> {
    return (innerObservable: Observable<T>) => {
      return innerObservable
        .pipe(
          catchError(error => {
            if(typeof error === 'string') {
              this.showErrorToast(error);
            } else if (error && error.message) {
              this.showErrorToast(error.message);
            } else {
              this.showErrorToast(errorMessage);
            }
            return EMPTY;
          })
        )
    };
  }

  showErrorToast(message?: string) {
    toast.error(message || 'Something went wrong...', {duration: 3000, position: 'bottom-right'});
  }

  showSuccessToast(message?: string) {
    toast.success(message || 'Successfully saved changes!', {duration: 3000, position: 'bottom-right'});
  }
}
