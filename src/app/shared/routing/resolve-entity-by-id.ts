import {ActivatedRouteSnapshot, ResolveFn} from '@angular/router';
import {Observable} from 'rxjs';
import {getNumberRouteParam, getRouteParam} from '@shared/routing/get-route-param';
import {redirectToNotFound} from '@shared/routing/redirects';
import {pipeRoutingResolveError} from '@shared/routing/pipe-routing-resolve-error';

export function resolveEntityByStringId<TEntity>(
  routeParam: string,
  request: (entityId: string) => Observable<TEntity>
): ResolveFn<TEntity> {
  return resolveEntityByGenericId(routeParam, request, getRouteParam);
}

export function resolveEntityById<TEntity>(
  routeParam: string,
  request: (entityId: number) => Observable<TEntity>
): ResolveFn<TEntity> {
    return resolveEntityByGenericId(routeParam, request, getNumberRouteParam);
}

export function resolveEntityByGenericId<TEntity, TId>(
  routeParam: string,
  request: (entityId: TId) => Observable<TEntity>,
  routeParamResolver: (route: ActivatedRouteSnapshot, paramName: string) => TId | undefined
): ResolveFn<TEntity> {
  return (route) => {
    const entityId = routeParamResolver(route, routeParam);
    if (entityId == undefined) {
      return redirectToNotFound();
    }

    return request(entityId)
      .pipe(
        pipeRoutingResolveError()
      );
  };
}
