/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Directive, ElementRef } from '@angular/core';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { SignpostFocusManager } from './providers/signpost-focus-manager.service';

@Directive({
  selector: '[clrSignpostTrigger]',
  host: {
    class: 'signpost-trigger',
    '[attr.aria-label]': 'commonStrings.keys.signpostToggle',
  },
})

/*********
 *
 * @description
 * A Directive added to the ClrSignpost Trigger button that will call the ClrSignpost.toggle() function to hide/show the
 * ClrSignpostContent.
 *
 */
export class ClrSignpostTrigger {
  constructor(
    private el: ElementRef,
    public commonStrings: ClrCommonStringsService,
    private signpostFocusManager: SignpostFocusManager
  ) {}

  ngOnInit() {
    this.signpostFocusManager.triggerEl = this.el.nativeElement;
  }
}
