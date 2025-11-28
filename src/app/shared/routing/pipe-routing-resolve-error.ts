import {catchError, Observable, of} from 'rxjs';
import {RedirectCommand, Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {inject} from '@angular/core';
import {redirectToForbidden, redirectToNotFound} from '@shared/routing/redirects';

/**
 * Catches any error and redirects to not-found
 */
export function pipeRoutingResolveError<T>(router = inject(Router)): (obs: Observable<T>) => Observable<T | RedirectCommand> {
  return (obs: Observable<T>) => {
    return obs
      .pipe(
        catchError(err => {
          if(err instanceof HttpErrorResponse && err.status === 403) {
            return of(redirectToForbidden(router));
          }
          return of(redirectToNotFound(router));
        })
      );
  };
}
