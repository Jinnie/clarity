/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import {
  Component,
  Inject,
  Input,
  OnDestroy,
  PLATFORM_ID,
  EventEmitter,
  ChangeDetectorRef,
  ElementRef,
  HostBinding,
  HostListener,
} from '@angular/core';

import { SIGNPOST_OFFSETS } from './signpost-offsets';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { SignpostFocusManager } from './providers/signpost-focus-manager.service';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { validPosition } from '../../utils/popover/position-operators';

@Component({
  selector: 'clr-signpost-content',
  template: `
      <div [ngClass]="getSignpostClasses()"
            clrFocusOnViewInit
            clrFocusTrap
            [style.transform]="getSignpostTransform()">
          <div class="signpost-wrap">
              <div class="popover-pointer"></div>
              <div class="signpost-content-body">
                  <ng-content></ng-content>
              </div>
              <div class="signpost-content-header">
                  <button type="button" [attr.aria-label]="commonStrings.keys.signpostClose" class="signpost-action close"
                          (click)="close()">
                      <clr-icon shape="close" [attr.title]="commonStrings.keys.close"></clr-icon>
                  </button>
              </div>
          </div>
      </div>
  `,
  host: {
    '[class.signpost-content]': 'true',
    role: 'dialog',
    'aria-modal': 'true',
  },
})
export class ClrSignpostContent implements OnDestroy {
  private document: Document;

  constructor(
    public commonStrings: ClrCommonStringsService,
    private el: ElementRef,
    private signpostFocusManager: SignpostFocusManager,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) document: any
  ) {
    // Defaults
    this.position = 'right-middle';
    this.document = document;
  }

  private _onClose: EventEmitter<void> = new EventEmitter();
  onClose: Observable<void> = this._onClose.asObservable();

  close() {
    this._onClose.emit();
  }

  private _position: string;

  get position() {
    return this._position;
  }

  updatePosition(position: string) {
    if (position !== this._position) {
      this._position = position;
      // With the current design this change is expected because we need to make adjustments
      // based on the position changes that were encapulated inside the smart popovers.
      this.cdr.detectChanges();
    }
  }

  getSignpostClasses() {
    return ['signpost-content', this.position];
  }

  getSignpostTransform() {
    return `translate(${this.offsetX}px, ${this.offsetY}px)`;
  }

  private get offsetX() {
    return SIGNPOST_OFFSETS[this.position].offsetX;
  }

  private get offsetY() {
    return SIGNPOST_OFFSETS[this.position].offsetY;
  }

  @Input('clrPosition')
  set position(position: string) {
    if (position && validPosition(position)) {
      this._position = position;
    } else {
      this._position = 'right-middle';
    }
  }

  ownsFocus(): boolean {
    return this.el.nativeElement.contains(this.document.activeElement);
  }

  ngOnDestroy() {
    console.log(
      'Буубааа',
      isPlatformBrowser(this.platformId),
      this.el.nativeElement.contains(this.document.activeElement)
    );
    console.log('Буубааа2', isPlatformBrowser(this.platformId), this.document.activeElement.tagName);
    // debugger;
    if (isPlatformBrowser(this.platformId) && this.el.nativeElement.contains(this.document.activeElement)) {
      this.signpostFocusManager.focusTrigger();
    }
  }
}
