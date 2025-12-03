import {DestroyRef, Directive, ElementRef, inject, OnInit, Renderer2} from "@angular/core";
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Observable} from 'rxjs';
import {ImageFileStore} from '../image-file.store';

@Directive()
export abstract class BaseImageFileLoaderDirective implements OnInit {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly photosStore = inject(ImageFileStore);

  ngOnInit() {
    this.getPhotoSubject$()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(file => {
        if(file) {
          this.readFile(file);
        } else {
          this.setImgSrc(this.getDefaultImgSrc());
        }
      });
  }

  protected abstract getPhotoSubject$(): Observable<File | undefined>;

  protected abstract getDefaultImgSrc(): string;

  private readFile(file: File) {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.setImgSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  private setImgSrc(imgSrc: string) {
    this.renderer.setAttribute(this.el.nativeElement, 'src', imgSrc);
  }
}
