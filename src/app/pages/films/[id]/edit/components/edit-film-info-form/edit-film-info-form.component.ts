import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BaseUpsertDialogComponent} from '../../../../../../core/dialog/abstract/base-upsert-dialog-component';
import {UpsertFilmDto} from '../../../../../../api';
import {FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ControlsOf} from '@shared/forms/utils/controls-of';
import {FormInputComponent} from '@shared/forms/components/form-input/form-input.component';

@Component({
  selector: 'app-edit-film-info-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './edit-film-info-form.component.html',
  imports: [
    FormInputComponent,
    ReactiveFormsModule,
  ]
})
export class EditFilmInfoFormComponent extends BaseUpsertDialogComponent<UpsertFilmDto> {
  protected override buildForm(): FormGroup<ControlsOf<UpsertFilmDto>> {
    return this.fb.group<ControlsOf<UpsertFilmDto>>({
      // TODO: check validators on backend
      title: this.fb.control('', [Validators.required]),
      description: this.fb.control('', [Validators.required]),
    });
  }
}
