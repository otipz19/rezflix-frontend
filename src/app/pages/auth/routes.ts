import {Routes} from '@angular/router';
import {LoginPage} from './login/page/login.page';
import {AuthLayout} from './auth.layout';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: LoginPage
      },
      // {
      //   path: 'register',
      //   component: RegisterPage
      // }
    ]
  }
];
