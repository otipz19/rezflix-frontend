import {ChangeDetectionStrategy, Component, inject, OnInit, Signal} from '@angular/core';
import {SuperAdminPageStore} from './state/store';
import {injectDispatch} from '@ngrx/signals/events';
import {superAdminPageEvents} from './state/events';
import {UserDto, UserTypeDto} from '../../../api';
import {UserCardComponent} from './components/user-card/user-card.component';
import {PaginatorComponent} from '@shared/components/paginator/paginator.component';
import {PaginationChangedEvent} from '@shared/components/paginator/pagination-changed-event';
import {TypeSelectorComponent} from './components/type-selector/type-selector.component';
import {ZardButtonComponent} from '@shared/zardui/components/button/button.component';
import {ZardIconComponent} from '@shared/zardui/components/icon/icon.component';
import {DialogService} from '../../../core/dialog/services/dialog.service';
import {UserControllerService, CreateUserDto} from '../../../api';
import {NotifyService} from '../../../core/notify/services/notify.service';
import {CreateUserFormComponent} from './components/create-user-form/create-user-form.component';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {SearchBarComponent} from '@shared/components/search-bar/search-bar.component';

@Component({
  selector: 'app-super-admin-page',
  imports: [
    UserCardComponent,
    PaginatorComponent,
    SearchBarComponent,
    TypeSelectorComponent,
    ZardButtonComponent,
    ZardIconComponent,
  ],
  templateUrl: './super-admin.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SuperAdminPageStore]
})
export class SuperAdminPage implements OnInit {
  private readonly store = inject(SuperAdminPageStore);
  private readonly dispatch = injectDispatch(superAdminPageEvents);
  private readonly searchQueryChange$ = new Subject<string>();

  protected readonly users: Signal<UserDto[]> = this.store.users;
  protected readonly isLoading: Signal<boolean> = this.store.isLoading;

  protected readonly pageIndex: Signal<number> = this.store.pageIndex;
  protected readonly pageSize: Signal<number> = this.store.pageSize;
  protected readonly total: Signal<number> = this.store.total;

  protected readonly searchQuery: Signal<string> = this.store.searchQuery;
  protected readonly selectedType: Signal<UserTypeDto | null> = this.store.selectedType;

  protected readonly UserTypeDto = UserTypeDto;

  constructor() {
    this.searchQueryChange$
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(v => this.dispatch.searchQueryChanged(v));
  }
  private readonly dialogService = inject(DialogService);
  private readonly api = inject(UserControllerService);
  private readonly notify = inject(NotifyService);

  protected openCreateUser() {
    this.dialogService.upsert$({
      zTitle: 'Create user',
      zContent: CreateUserFormComponent,
      zOkText: 'Create',
      zWidth: '520px'
    }, (value: any) => {
      const dto: CreateUserDto = {
        username: value.username,
        password: value.password,
        type: value.type,
        about: value.about
      };

      return this.api.createUser(dto).pipe(
        this.notify.notifyHttpRequest('User was created successfully!')
      );
    })
    .subscribe(() => {
        this.dispatch.opened();
    });
  }

  ngOnInit() {
    this.dispatch.opened();
  }

  protected onPageChanged(e: PaginationChangedEvent) {
    this.dispatch.paginationChanged(e);
  }

  protected onQueryChanged(q: string) {
    this.searchQueryChange$.next(q);
  }

  protected onTypeChanged(type: string | null) {
    this.dispatch.typeChanged(type ? (type as UserTypeDto) : null);
  }
}
