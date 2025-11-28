import {computed, inject, Injectable, signal} from "@angular/core";
import {catchError, EMPTY, finalize, map, Observable, of, switchMap, tap, throwError} from "rxjs";
import {HttpContext, HttpErrorResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {
  AuthenticationControllerService,
  CurrentUserInfoDto,
  LoginRequestDto,
  UserControllerService,
  UserRoleDto
} from '../../../api';
import {SKIP_AUTH_INTERCEPTOR} from '../interceptors/auth.interceptor';
import {voidOperator} from '@shared/utils/void-operator';
import {NotifyService} from '../../notify/services/notify.service';

type TokensDto = {
  accessToken: string,
  refreshToken: string
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static readonly LS_KEY_TOKENS_DTO = "REZFLIX_LS_KEY_TOKENS_DTO";

  private readonly authApi = inject(AuthenticationControllerService);
  private readonly userApi = inject(UserControllerService);
  private readonly router = inject(Router);
  private readonly notify = inject(NotifyService);

  private _tokensDto: TokensDto | undefined;

  private readonly _currentUser = signal<CurrentUserInfoDto | undefined>(undefined);
  readonly currentUser = this._currentUser.asReadonly();

  private readonly _isLoadingUser = signal(false);
  readonly isLoadingUser = this._isLoadingUser.asReadonly();

  readonly isAuthenticated = computed(() => {
    const user = this.currentUser();
    return Boolean(user && user.role !== UserRoleDto.ANONYMOUS);
  });
  readonly role = computed(() => this.currentUser()?.role);

  readonly username = computed(() => {
    const user = this.currentUser();
    if (!user) {
      return 'ANONYMOUS';
    }
    if (user.role === UserRoleDto.SUPER_ADMIN) {
      return 'SUPER_ADMIN';
    }
    return user.info?.username ?? 'NONAME';
  });

  hasRole(...roles: UserRoleDto[]): boolean {
    const role = this.role();
    return Boolean(role && roles.includes(role));
  }

  login$(loginDto: LoginRequestDto): Observable<void> {
    this._isLoadingUser.set(true);

    return this.authApi.login(loginDto)
      .pipe(
        tap(({accessToken, refreshToken}) => {
          this.setTokens(accessToken, refreshToken);
        }),
        switchMap(() => this.setCurrentUser$()),
        finalize(() => this._isLoadingUser.set(false)),
        this.notify.notifyHttpError()
      );
  }

  restoreSession$(): Observable<void> {
    const fromLs = localStorage.getItem(AuthService.LS_KEY_TOKENS_DTO);
    if (!fromLs) {
      return EMPTY;
    }

    this._tokensDto = JSON.parse(fromLs);
    this._isLoadingUser.set(true);

    return this.setCurrentUser$()
      .pipe(
        // Backend may return ANONYMOUS user if access token expired,
        // so try to refresh session in this case
        switchMap(() => {
          if (this.role() === UserRoleDto.ANONYMOUS) {
            return this.refreshSession$()
              .pipe(
                switchMap(() => this.setCurrentUser$())
              );
          }
          return of();
        }),
        catchError(error => {
          // If token expired and so restoration failed
          if (error instanceof HttpErrorResponse && error.status === 401) {
            this.closeSession();
            return EMPTY;
          }
          return throwError(() => error);
        }),
        finalize(() => this._isLoadingUser.set(false)),
      );
  }

  setCurrentUser$(): Observable<void> {
    return this.userApi.getCurrentUserInfo()
      .pipe(
        tap(user => {
          this._currentUser.set(user);
        }),
        voidOperator()
      );
  }

  refreshSession$(): Observable<string> {
    const refreshToken = this.refreshToken;
    if (!refreshToken) {
      throw new Error('refreshSession was called without active session');
    }

    return this.authApi.refresh(
      {refreshToken},
      'body',
      false,
      {context: new HttpContext().set(SKIP_AUTH_INTERCEPTOR, true)}
    )
      .pipe(
        map(({accessToken}) => accessToken),
        tap((accessToken) => {
          this.setTokens(accessToken, refreshToken);
        }),
        this.notify.notifyHttpError()
      )
  }

  logout() {
    this.closeSession();
    this.router.navigate(['/']);
  }

  closeSession() {
    this.clearTokens();
    this._currentUser.set(undefined);
  }

  get accessToken(): string | undefined {
    return this._tokensDto?.accessToken;
  }

  get refreshToken(): string | undefined {
    return this._tokensDto?.refreshToken;
  }

  private setTokens(accessToken: string, refreshToken: string) {
    this._tokensDto = {accessToken, refreshToken};
    localStorage.setItem(AuthService.LS_KEY_TOKENS_DTO, JSON.stringify(this._tokensDto));
  }

  private clearTokens() {
    localStorage.removeItem(AuthService.LS_KEY_TOKENS_DTO);
    this._tokensDto = undefined;
  }
}
