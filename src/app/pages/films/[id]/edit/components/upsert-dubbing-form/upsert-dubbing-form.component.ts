import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BaseUpsertDialogComponent} from '../../../../../../core/dialog/abstract/base-upsert-dialog-component';
import {UpdateDubbingDto} from '../../../../../../api';
import {FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ControlsOf} from '@shared/forms/utils/controls-of';
import {FormInputComponent} from '@shared/forms/components/form-input/form-input.component';

@Component({
  selector: 'app-upsert-dubbing-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './upsert-dubbing-form.component.html',
  imports: [
    FormInputComponent,
    ReactiveFormsModule,
  ]
})
export class UpsertDubbingFormComponent extends BaseUpsertDialogComponent<UpdateDubbingDto> {
  protected override buildForm(): FormGroup<ControlsOf<UpdateDubbingDto>> {
    return this.fb.group<ControlsOf<UpdateDubbingDto>>({
      // TODO: check validators on backend
      name: this.fb.control('', [Validators.required]),
    });
  }
}
