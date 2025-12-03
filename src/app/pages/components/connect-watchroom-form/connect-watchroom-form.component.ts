import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import {ControlsOf} from '@shared/forms/utils/controls-of';
import { BaseUpsertDialogComponent } from '../../../core/dialog/abstract/base-upsert-dialog-component';
import {FormInputComponent} from '@shared/forms/components/form-input/form-input.component';

export interface ConnectWatchRoomFormValue {
  roomId: string;
  password?: string;
}

@Component({
  selector: 'app-connect-watchroom-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" class="space-y-4">
      <app-form-input [control]="form.controls.roomId" label="Room id" type="text" placeholder="00000000-0000-0000-0000-000000000000"></app-form-input>
      <app-form-input [control]="form.controls.password!" label="Room password (optional)" type="password" placeholder="••••••••"></app-form-input>
    </form>
  `,
  imports: [ReactiveFormsModule, FormInputComponent]
})
export class ConnectWatchRoomFormComponent extends BaseUpsertDialogComponent<ConnectWatchRoomFormValue> {
  protected override buildForm(): FormGroup<ControlsOf<ConnectWatchRoomFormValue>> {
    return this.fb.group<ControlsOf<ConnectWatchRoomFormValue>>({
      roomId: this.fb.control<string>('', [Validators.required]),
      password: this.fb.control<string | undefined>(undefined),
    });
  }
}
