import {ActivatedRouteSnapshot} from '@angular/router';

export function getNumberRouteParam(route: ActivatedRouteSnapshot, paramName: string): number | undefined {
  const param = getRouteParam(route, paramName);
  if(param == undefined) {
    return undefined;
  }
  return Number(param);
}

export function getRouteParam(route: ActivatedRouteSnapshot, paramName: string): string | undefined {
  const param = route.paramMap.get(paramName);
  if(param == undefined) {
    return undefined;
  }
  return param;
}
