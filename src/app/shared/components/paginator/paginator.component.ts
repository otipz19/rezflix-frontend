import {ChangeDetectionStrategy, Component, computed, input, output, Signal} from '@angular/core';

import {ZardPaginationModule} from '@shared/zardui/components/pagination/pagination.module';
import {ZardPaginationContentComponent} from '@shared/zardui/components/pagination/pagination.component';
import {range} from '@shared/utils/range';

export type PaginationChangedEvent = {
  pageIndex: number;
  pageSize: number;
}

@Component({
  selector: 'app-paginator',
  imports: [ZardPaginationModule, ZardPaginationContentComponent],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'paginator.component.html'
})
export class PaginatorComponent {
  readonly pageIndex = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly totalItems = input.required<number>();
  readonly maxPagesToShow = input<number>(6);

  readonly paginationChanged = output<PaginationChangedEvent>();

  readonly totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));
  readonly pages: Signal<Array<number | 'ellipsis'>> = computed(() => {
    if(this.totalPages() <= this.maxPagesToShow()) {
      return range(0, this.totalPages());
    }

    const halfPagesToShow = Math.floor(this.maxPagesToShow() / 2);

    return Array.prototype.concat(
      range(0, halfPagesToShow),
      ['ellipsis'],
      range(this.totalPages() - halfPagesToShow, this.totalPages()),
    );
  });

  protected goToPrevious() {
    if (this.pageIndex() > 1) {
      this.goToPage(this.pageIndex() - 1);
    }
  }

  protected goToNext() {
    if (this.pageIndex() < this.totalPages()) {
      this.goToPage(this.pageIndex() + 1);
    }
  }

  protected goToPage(pageIndex: number) {
    this.paginationChanged.emit({pageIndex, pageSize: this.pageSize()});
  }
}
