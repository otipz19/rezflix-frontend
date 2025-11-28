import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-not-found-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
  ],
  template: `
    <div
      class="bg-background/75 mx-auto w-fit md:min-w-xl min-h-64 mt-24 p-4 md:p-8 lg:p-12 rounded-md flex flex-col items-center justify-center gap-8">
      <p class="text-3xl md:text-5xl text-muted-foreground tracking-widest">NOT FOUND</p>
      <h1 class="text-5xl md:text-7xl">404</h1>
      <p class="text-muted-foreground text-xl md:text-2xl text-center">The requested resource was not found</p>
    </div>
  `,
})
export class NotFoundPage {

}
