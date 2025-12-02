import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ControlsOf} from '@shared/forms/utils/controls-of';
import {FormInputComponent} from '@shared/forms/components/form-input/form-input.component';
import {BaseUpsertDialogComponent} from '../../../../../core/dialog/abstract/base-upsert-dialog-component';
import {CreateEpisodeMetadataDto} from '../create-episode-form/create-episode-form.component';

@Component({
  selector: 'app-upsert-episode-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './update-episode-form.component.html',
  imports: [
    FormInputComponent,
    ReactiveFormsModule,
  ]
})
export class UpdateEpisodeFormComponent extends BaseUpsertDialogComponent<CreateEpisodeMetadataDto> {
  protected override buildForm(): FormGroup<ControlsOf<CreateEpisodeMetadataDto>> {
      return this.fb.group<ControlsOf<CreateEpisodeMetadataDto>>({
        // TODO: check validators on backend
        title: this.fb.control('', [Validators.required])
      });
  }
}
