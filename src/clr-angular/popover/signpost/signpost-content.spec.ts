/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

// I'm giving up, I'm using the datagrid ones for now.
import { TestContext } from '../../data/datagrid/helpers.spec';
import { ClrIconCustomTag } from '../../icon/icon';
import { IfOpenService } from '../../utils/conditional/if-open.service';
import { POPOVER_HOST_ANCHOR } from '../common/popover-host-anchor.token';

import { ClrSignpostContent } from './signpost-content';
import { SIGNPOST_OFFSETS } from './signpost-offsets';
import { SignpostFocusManager } from './providers/signpost-focus-manager.service';

export default function(): void {
  describe('ClrSignpostContent', function() {
    let context: TestContext<ClrSignpostContent, SimpleTest>;

    beforeEach(function() {
      context = this.createOnly(
        ClrSignpostContent,
        SimpleTest,
        [IfOpenService, SignpostFocusManager],
        [ClrIconCustomTag]
      );
    });

    afterEach(() => {
      context.fixture.destroy();
    });

    it('has an id', () => {
      expect(context.clarityElement.getAttribute('id')).toBeDefined();
    });

    it('projects content when open', function() {
      expect(context.clarityElement.textContent).toContain('Signpost content');
    });

    it('has a close button that updates the IfOpenService.open value', function() {
      const closer: HTMLElement = context.clarityElement.querySelector('.signpost-action');
      expect(closer).toBeDefined();
      const service: IfOpenService = TestBed.get(IfOpenService);
      const testValue: boolean = service.open;
      closer.click();
      context.detectChanges();
      expect(testValue).not.toEqual(service.open);
    });

    it('does not allow multiple open popovers', function() {
      expect((<any>context.clarityDirective).popoverOptions.allowMultipleOpen).toBeFalsy();
    });

    it('takes an input for position', function() {
      context.testComponent.position = 'top-middle';
      context.detectChanges();
      expect(context.clarityDirective.position).toBe('top-middle');
    });

    it('has a default signpost content position', function() {
      expect(context.clarityDirective.position).toBe('right-middle');
      expect(context.clarityElement.classList).toContain('right-middle');
    });

    // Not iterating here on purpose, we want to keep these hard-coded in the tests.
    testOffset('top-left');
    testOffset('top-middle');
    testOffset('top-right');
    testOffset('right-top');
    testOffset('right-middle');
    testOffset('right-bottom');
    testOffset('bottom-right');
    testOffset('bottom-middle');
    testOffset('bottom-left');
    testOffset('left-bottom');
    testOffset('left-middle');
    testOffset('left-top');

    function testOffset(name: string): void {
      it('has a ' + name + ' signpost content position', function() {
        context.clarityDirective.position = name;
        context.detectChanges();
        const position = SIGNPOST_OFFSETS[name];
        /*********
         *
         * There are 3 things to test here
         * 0. correct class on the host
         * 1. Correct Y offset
         * 2. Correct X offset
         *
         */
        expect(context.clarityElement.classList).toContain(name);
        expect((<any>context.clarityDirective).popoverOptions.offsetY).toBe(position.offsetY);
        expect((<any>context.clarityDirective).popoverOptions.offsetX).toBe(position.offsetX);
      });
    }
  });
}

@Component({
  template: `
        <button class="outside-click-test" (click)="bodyClickHandler()">
            Button to test clicks outside of the dropdown component
        </button>
        <clr-signpost-content [clrPosition]="position">
            Signpost content
        </clr-signpost-content>
    `,
  providers: [{ provide: POPOVER_HOST_ANCHOR, useExisting: ElementRef }],
})
class SimpleTest {
  position: string = 'right-middle';
}
