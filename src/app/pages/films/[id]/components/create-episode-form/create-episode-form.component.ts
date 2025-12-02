import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ControlsOf} from '@shared/forms/utils/controls-of';
import {FormInputComponent} from '@shared/forms/components/form-input/form-input.component';
import {CreateEpisodeRequest, UpdateEpisodeDto} from '../../../../../api';
import {IUpsertDialogComponent} from '../../../../../core/dialog/abstract/upsert-dialog-component.interface';
import {map, Observable} from 'rxjs';
import {validateFormSubmit$} from '@shared/forms/utils/check-valid-form-submit';
import {EpisodeFileDropZoneComponent} from '../episode-file-drop-zone/episode-file-drop-zone.component';

export type CreateEpisodeMetadataDto = Pick<UpdateEpisodeDto, 'title'>
export type CreateEpisodeDto = CreateEpisodeRequest & CreateEpisodeMetadataDto;

@Component({
  selector: 'app-upsert-episode-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './create-episode-form.component.html',
  imports: [
    FormInputComponent,
    ReactiveFormsModule,
    EpisodeFileDropZoneComponent,
  ]
})
export class CreateEpisodeFormComponent implements IUpsertDialogComponent<CreateEpisodeDto> {
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly form = this.fb.group<ControlsOf<CreateEpisodeMetadataDto>>({
    // TODO: check validators on backend
    title: this.fb.control('', [Validators.required])
  });

  protected file?: File;

  protected onFileUpdate(file: File | undefined) {
    this.file = file;
  }

  validate$(): Observable<boolean> {
    return validateFormSubmit$(this.form)
      .pipe(
        map(v => v && this.file != undefined)
      );
  }

  getFormValue(): CreateEpisodeDto {
    const metadata = this.form.getRawValue() as CreateEpisodeMetadataDto;
    return {...metadata, file: this.file};
  }
}
