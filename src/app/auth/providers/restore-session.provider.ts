import {inject, provideAppInitializer} from "@angular/core";
import {AuthService} from '../services/auth.service';

export const restoreSessionProvider = provideAppInitializer(() => {
  const authService = inject(AuthService);
  return authService.restoreSession$();
});
