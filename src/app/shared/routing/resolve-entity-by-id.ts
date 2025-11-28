import {ResolveFn} from '@angular/router';
import {Observable} from 'rxjs';
import {getNumberRouteParam} from '@shared/routing/get-route-param';
import {redirectToNotFound} from '@shared/routing/redirects';
import {pipeRoutingResolveError} from '@shared/routing/pipe-routing-resolve-error';

export function resolveEntityById<TEntity>(routeParam: string, request: (entityId: number) => Observable<TEntity>): ResolveFn<TEntity> {
  return (route) => {
    const entityId = getNumberRouteParam(route, routeParam);
    if (entityId == undefined) {
      return redirectToNotFound();
    }

    return request(entityId)
      .pipe(
        pipeRoutingResolveError()
      );
  };
}
