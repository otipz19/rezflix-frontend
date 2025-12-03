import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule, FormGroup} from '@angular/forms';
import {BaseUpsertDialogComponent} from '../../../../../core/dialog/abstract/base-upsert-dialog-component';
import {ControlsOf} from '@shared/forms/utils/controls-of';
import {FormInputComponent} from '@shared/forms/components/form-input/form-input.component';
import { CreateWatchRoomDto } from 'src/app/api';

@Component({
  selector: 'app-create-watchroom-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form">
      <app-form-input [control]="form.controls.password!" label="Room password (optional)" type="password" placeholder="••••••••"></app-form-input>
    </form>
  `,
  imports: [ReactiveFormsModule, FormInputComponent]
})
export class CreateWatchRoomFormComponent extends BaseUpsertDialogComponent<CreateWatchRoomDto> {
  protected override buildForm(): FormGroup<ControlsOf<CreateWatchRoomDto>> {
    return this.fb.group<ControlsOf<CreateWatchRoomDto>>({
      episodeId: this.fb.control<string>(''),
      password: this.fb.control<string | undefined>(undefined),
    });
  }
}
