/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';

import { ClrIconModule } from '../../icon/icon.module';
import { ClrConditionalModule } from '../../utils/conditional/conditional.module';
import { ClrCommonPopoverModule } from '../common/popover.module';
import { ClrFocusOnViewInitModule } from '../../utils/focus/focus-on-view-init/focus-on-view-init.module';
import { ClrPopoverModuleNext } from '../../utils/popover/popover.module';
import { ClrPopoverAdapterModule } from '../../utils/popover/adapter/popover-adapter.module';
import { ClrFocusTrapModule } from '../../utils/focus-trap/focus-trap.module';

import { ClrSignpost } from './signpost';
import { ClrSignpostContent } from './signpost-content';
import { ClrSignpostTrigger } from './signpost-trigger';

export const CLR_SIGNPOST_DIRECTIVES: Type<any>[] = [ClrSignpost, ClrSignpostContent, ClrSignpostTrigger];

@NgModule({
  imports: [
    CommonModule,
    ClrCommonPopoverModule,
    ClrIconModule,
    ClrFocusOnViewInitModule,
    ClrFocusTrapModule,
    ClrPopoverModuleNext,
    ClrPopoverAdapterModule,
  ],
  declarations: [CLR_SIGNPOST_DIRECTIVES],
  exports: [CLR_SIGNPOST_DIRECTIVES, ClrConditionalModule],
})
export class ClrSignpostModule {}
