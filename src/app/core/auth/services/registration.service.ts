import {inject, Injectable, signal} from '@angular/core';
import {finalize, Observable, switchMap} from 'rxjs';
import {RegisterUserDto, UserControllerService} from '../../../api';
import {AuthService} from './auth.service';
import {NotifyService} from '../../notify/services/notify.service';
import {voidOperator} from '@shared/utils/void-operator';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private readonly userApi = inject(UserControllerService);
  private readonly authService = inject(AuthService);
  private readonly notify = inject(NotifyService);

  private readonly _isLoading = signal(false);
  readonly isLoading = this._isLoading.asReadonly();

  register$(dto: RegisterUserDto): Observable<void> {
    this._isLoading.set(true);
    return this.userApi.registerUser(dto)
      .pipe(
        switchMap(() => {
          return this.authService.login$(dto);
        }),
        finalize(() => this._isLoading.set(false)),
        this.notify.notifySuccess('Successfully registered!'),
        voidOperator()
      );
  }
}
