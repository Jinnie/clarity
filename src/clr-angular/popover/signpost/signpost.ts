/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ContentChild, ViewChild, OnDestroy } from '@angular/core';

import { IfOpenService } from '../../utils/conditional/if-open.service';

import { ClrSignpostTrigger } from './signpost-trigger';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { SignpostFocusManager } from './providers/signpost-focus-manager.service';
import { ClrSignpostContent } from './signpost-content';
import { ClrPopoverAdapter } from '../../utils/popover/adapter/popover-adapter';
import { Subscription } from 'rxjs';

@Component({
  selector: 'clr-signpost',
  template: `
        <clr-popover-adapter [clrPosition]="position" (clrSmartPositionReady)="updatePosition($event)">
            <button
                *ngIf="!useCustomTrigger"
                clrAnchorPoint
                type="button"
                clrSignpostTrigger
                class="signpost-action btn btn-small btn-link">
                <clr-icon shape="info" [attr.title]="commonStrings.keys.info"></clr-icon>
            </button>
            <ng-container *ngIf="useCustomTrigger" clrAnchorPoint>
                <ng-content select="[clrSignpostTrigger]"></ng-content>
            </ng-container>
            <ng-content></ng-content>
        </clr-popover-adapter>
    `,
  host: { '[class.signpost]': 'true' },
  providers: [
    // This allows us to use *clrIfOpen on the content. The service itself can work without this provider,
    // but we have to include it for the ClrSignpost itself.
    IfOpenService,
    SignpostFocusManager,
  ],
})

/*********
 *
 * @class ClrSignpost
 *
 * @description
 * Class used to configure and control the state of a ClrSignpost and its associated ClrSignpostContent.
 * It supports the clrPosition with a 'right-middle' default.
 *
 */
export class ClrSignpost implements OnDestroy {
  constructor(public commonStrings: ClrCommonStringsService) {}

  /**********
   * @property useCustomTrigger
   *
   * @description
   * Flag used to determine if we need to use the default trigger or a user supplied trigger element.
   *
   */
  public useCustomTrigger: boolean = false;

  public position: string;

  updatePosition(position: string) {
    if (this._content) {
      this._content.updatePosition(position);
    }
  }

  private closeSubscription: Subscription;

  /**********
   * @property signPostTrigger
   *
   * @description
   * Uses ContentChild to check for a user supplied element with the ClrSignpostTrigger on it.
   *
   */
  @ContentChild(ClrSignpostTrigger, { static: false })
  set customTrigger(trigger: ClrSignpostTrigger) {
    this.useCustomTrigger = !!trigger;
  }

  @ViewChild(ClrPopoverAdapter, { static: false })
  private popoverAdapter: ClrPopoverAdapter;

  private _content: ClrSignpostContent;
  @ContentChild(ClrSignpostContent, { static: false })
  set content(content: ClrSignpostContent) {
    if (!content) {
      return;
    }
    this._content = content;
    this.position = content.position;

    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
    // We have to manually handle the result of close-button click, as this button is defined
    // in the signpost and does not share services (event and trigger) with the popover adapter.
    this.closeSubscription = content.onClose.subscribe(() => {
      this.popoverAdapter.openState = false;
    });
  }

  ngOnDestroy() {
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
  }
}
