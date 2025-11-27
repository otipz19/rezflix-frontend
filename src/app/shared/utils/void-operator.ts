import {Observable, Subscriber} from "rxjs";

export function voidOperator(): (innerObservable: Observable<any>) => Observable<void> {
  return (innerObservable: Observable<any>) => {
    return new Observable<void>((subscriber: Subscriber<void>) => {
      const innerSubscription = innerObservable.subscribe({
        next: () => subscriber.next(),
        error: (err) => subscriber.error(err),
        complete: () => subscriber.complete()
      });

      return () => {
        innerSubscription.unsubscribe();
      }
    });
  };
}
