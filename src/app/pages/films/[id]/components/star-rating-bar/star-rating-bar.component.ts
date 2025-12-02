import {ChangeDetectionStrategy, Component, computed, input, linkedSignal, output} from '@angular/core';

@Component({
  selector: 'app-star-rating-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  template: `
    <div class="flex items-center gap-0.5" (mouseleave)="onMouseLeave()">
      @for (star of stars(); track $index) {
        <img [src]="star.isFilled ? '/star.svg' : '/star-empty.svg'"
             (mouseenter)="onMouseEnter($index)"
             (click)="changeRating.emit($index + 1)"
             alt="Star icon"
             class="size-6 object-contain"
        />
      }
    </div>
  `
})
export class StarRatingBarComponent {
  readonly rating = input.required<number>();
  readonly totalStars = input<number>(5);
  readonly disableHovering = input<boolean>(false);

  readonly changeRating = output<number>();

  protected readonly normalizedRating = computed(() => {
   return Math.floor(Math.max(0, Math.min(this.rating(), this.totalStars())));
  });

  protected readonly stars = linkedSignal(() => {
    return this.getStarsArray(this.totalStars(), this.normalizedRating());
  });

  protected onMouseEnter(index: number) {
    if(this.disableHovering()) {
      return;
    }

    this.stars.set(this.getStarsArray(this.totalStars(), index + 1));
  }

  protected onMouseLeave() {
    if(this.disableHovering()) {
      return;
    }

    this.stars.set(this.getStarsArray(this.totalStars(), this.normalizedRating()));
  }

  private getStarsArray(length: number, filledTo: number) {
    return Array.from({length}, (_, i) => ({isFilled: i < filledTo}));
  }
}
