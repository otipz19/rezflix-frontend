import {BaseImageFileLoaderDirective} from './base-image-file-loader.directive';
import {Directive, input} from '@angular/core';
import {Observable} from 'rxjs';
import {UserDto} from '../../../api';

@Directive({
  selector: 'img[userProfilePhotoLoader]',
  standalone: true,
})
export class UserProfilePhotoLoaderDirective extends BaseImageFileLoaderDirective {
  readonly userId = input.required<UserDto['id']>();

  protected override getPhotoSubject$(): Observable<File | undefined> {
    return this.photosStore.getUserPhotoSubject$(this.userId());
  }

  protected override getDefaultImgSrc(): string {
    return 'assets/icons/user-default-avatar.png';
  }
}
