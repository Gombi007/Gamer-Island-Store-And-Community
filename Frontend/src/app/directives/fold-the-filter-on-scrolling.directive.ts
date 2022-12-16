import { Directive, HostListener } from '@angular/core';
import { StoreService } from '../store/config/store.service';

@Directive({
  selector: '[appFoldTheFilterOnScrolling]'
})
export class FoldTheFilterOnScrollingDirective {

  constructor(private storeService: StoreService) { }

  @HostListener('keydown.arrowdown', ['$event'])
  @HostListener('keydown.arrowup', ['$event'])
  @HostListener('wheel', ['$event'])
  @HostListener('touchmove', ['$event'])
  foldFilter() {
    if (this.storeService.showFullFilterWindow) {
      this.storeService.showFullFilterWindow = false;
    }
  }
}
