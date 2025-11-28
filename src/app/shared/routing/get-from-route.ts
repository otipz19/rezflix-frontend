import {inject} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

export function getFromRoute<T>(key: string, activatedRoute = inject(ActivatedRoute)): T {
  const value = activatedRoute.snapshot.data[key];
  if(value == undefined) {
    throw new Error(`No value in route by key: ${key}`);
  }
  return value as T;
}
