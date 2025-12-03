import {Component, inject} from '@angular/core';
import {IUpsertDialogComponent} from '../../../../core/dialog/abstract/upsert-dialog-component.interface';
import {Observable, of} from 'rxjs';
import {Z_MODAL_DATA} from '@shared/zardui/components/dialog/dialog.service';
import {
  ImageCropperWrapperComponent
} from '@shared/image-cropping/components/image-cropper/image-cropper-wrapper.component';

export type ImageDto = {
  file?: File
};

@Component({
  selector: 'app-image-upload-modal',
  imports: [
    ImageCropperWrapperComponent
  ],
  templateUrl: './image-upload-modal.component.html',
})
export class ImageUploadModalComponent implements IUpsertDialogComponent<ImageDto> {
  private readonly zData: ImageDto = inject(Z_MODAL_DATA);

  protected imageFile?: File;

  constructor() {
    if (this.zData) {
      this.imageFile = this.zData.file;
    }
  }

  protected onImageChange(file: File | undefined) {
    this.imageFile = file;
  }

  validate$(): Observable<boolean> {
    return of(true);
  }

  getFormValue(): ImageDto {
    return {file: this.imageFile};
  }
}
