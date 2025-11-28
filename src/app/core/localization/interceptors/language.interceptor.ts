import {HttpInterceptorFn} from '@angular/common/http';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req.clone(
    {
      setHeaders: {
        'Accept-Language': 'en-US'
      }
    }
  ))
};
