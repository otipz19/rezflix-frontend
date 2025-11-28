import {RedirectCommand, Router} from '@angular/router';
import {inject} from '@angular/core';
import {of} from 'rxjs';

export function redirectToNotFound$(router: Router) {
  return redirectTo$("not-found", router);
}

export function redirectToForbidden$(router: Router) {
  return redirectTo$("forbidden", router);
}

/**
 * Use only in injection context
 */
export function redirectToNotFound(router = inject(Router)) {
  return redirectTo("not-found", router);
}

/**
 * Use only in injection context
 */
export function redirectToForbidden(router = inject(Router)) {
  return redirectTo("forbidden", router);
}

export function redirectTo$(url: string, router: Router) {
  return of(redirectTo(url, router));
}

/**
 * Use only in injection context
 */
export function redirectTo(url: string, router = inject(Router)) {
  return new RedirectCommand(router.parseUrl(url));
}
