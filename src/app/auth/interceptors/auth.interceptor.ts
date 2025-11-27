import {inject} from "@angular/core";
import {HttpContextToken, HttpErrorResponse, HttpInterceptorFn, HttpRequest} from "@angular/common/http";
import {catchError, switchMap, throwError} from "rxjs";
import {AuthService} from '../services/auth.service';

export const SKIP_AUTH_INTERCEPTOR = new HttpContextToken<boolean>(() => false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_AUTH_INTERCEPTOR)) {
    return next(req);
  }

  const authService = inject(AuthService);
  const token = authService.accessToken;

  if (token) {
    req = addAuthHeader(req, token);
  }

  return next(req)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 && authService.refreshToken) {
          return authService.refreshSession$()
            .pipe(
              switchMap(newToken => {
                const retryRequest = addAuthHeader(req, newToken);
                return next(retryRequest);
              })
            )
        }

        return throwError(() => err);
      })
    );
};

function addAuthHeader(req: HttpRequest<any>, token: string): HttpRequest<any> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}
