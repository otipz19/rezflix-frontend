import {Component, output} from '@angular/core';
import {ImageCroppedEvent, ImageCropperComponent} from "ngx-image-cropper";
import {ImageDropzoneComponent} from '@shared/image-cropping/components/image-dropzone/image-dropzone.component';

@Component({
  selector: 'app-image-cropper-wrapper',
  imports: [
    ImageCropperComponent,
    ImageDropzoneComponent,
  ],
  templateUrl: './image-cropper-wrapper.component.html',
  host: {
    class: 'relative'
  }
})
export class ImageCropperWrapperComponent {
  protected readonly imageChange = output<File | undefined>();

  protected imageFile?: File;

  protected onFileUpload(file: File) {
    this.imageFile = file;
  }

  protected onImageCropped(event: ImageCroppedEvent) {
    this.imageChange.emit(event.blob ? new File([event.blob], 'image.png', {type: 'image/png'}) : undefined);
  }

  protected onRemoveImage() {
    this.imageFile = undefined;
    this.imageChange.emit(undefined);
  }
}
