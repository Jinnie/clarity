/*
 * Copyright (c) 2016-2019 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, ViewChild, ElementRef } from '@angular/core';

import { IfOpenService } from '../../utils/conditional/if-open.service';
import { spec, TestContext } from '../../utils/testing/helpers.spec';

import { ClrSignpost } from './signpost';
import { ClrSignpostModule } from './signpost.module';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { ClrPopoverAdapter } from 'src/clr-angular/utils/popover/adapter/popover-adapter';
import { By } from '@angular/platform-browser';

interface Context extends TestContext<ClrSignpost, TestDefaultSignpost | TestCustomTriggerSignpost> {
  ifOpenService: IfOpenService;
  toggleService: ClrPopoverToggleService;
  triggerButton: HTMLButtonElement;
  contentCloseButton: HTMLButtonElement;
  content: HTMLDivElement;
}

export default function(): void {
  describe('Signpost', function() {
    describe('default trigger', function() {
      spec(ClrSignpost, TestDefaultSignpost, ClrSignpostModule);

      beforeEach(function(this: Context) {
        this.ifOpenService = this.getClarityProvider(IfOpenService);
      });

      it('adds the .signpost class to clr-signpost', function(this: Context) {
        expect(this.clarityElement.classList).toContain('signpost');
      });

      it('has a default trigger that can hide/show content', function(this: Context) {
        const signpostToggle: HTMLElement = this.hostElement.querySelector('.signpost-action');
        let signpostContent: HTMLElement;

        // Test we have a trigger
        expect(signpostToggle).not.toBeNull();

        // // Test that content shows
        signpostToggle.click();
        this.detectChanges();
        signpostContent = document.body.querySelector('.signpost-content');
        expect(signpostContent).not.toBeNull();
        expect(this.ifOpenService.open).toBe(true);

        // Test that content hides again
        signpostToggle.click();
        this.detectChanges();
        signpostContent = document.body.querySelector('.signpost-content');
        expect(signpostContent).toBeNull();
        expect(this.ifOpenService.open).toBe(false);
      });
    });

    describe('focus management', function() {
      spec(ClrSignpost, TestCustomTriggerSignpost, ClrSignpostModule);

      beforeEach(function(this: Context) {
        this.ifOpenService = this.getClarityProvider(IfOpenService);
        this.toggleService = this.fixture.debugElement
          .query(By.directive(ClrPopoverAdapter))
          .injector.get(ClrPopoverToggleService);
      });

      it('should not get focus on trigger initially', function(this: Context) {
        const signpostToggle: HTMLElement = this.hostElement.querySelector('.signpost-action');
        this.ifOpenService.open = false;
        this.detectChanges();
        expect(signpostToggle).not.toBeNull();
        expect(document.activeElement).not.toBe(signpostToggle);
      });

      it('should not get focus back on trigger if signpost gets closed with outside click on another interactive element', function(this: Context) {
        this.toggleService.open = true;
        this.detectChanges();
        expect(document.body.querySelector('.signpost-content')).not.toBeNull();

        // dynamic click doesn't set the focus so here manually focusing first
        this.hostComponent.outsideClickBtn.nativeElement.focus();
        this.hostComponent.outsideClickBtn.nativeElement.click();
        this.detectChanges();

        expect(document.body.querySelector('.signpost-content')).toBeNull();
        expect(document.activeElement).toBe(this.hostComponent.outsideClickBtn.nativeElement);
      });

      fit('should get focus back on trigger if signpost gets closed with outside click on non-interactive element', function(this: Context) {
        this.toggleService.open = true;
        this.detectChanges();
        expect(document.body.querySelector('.signpost-content')).not.toBeNull();
        (document.body.querySelector('.signpost-content') as HTMLElement).focus();
        document.body.click();
        // this.detectChanges();
        expect(document.body.querySelector('.signpost-content')).toBeNull();
        expect(document.activeElement).toBe(this.hostElement.querySelector('.signpost-action'));
      });

      it('should get focus back on trigger if signpost gets closed while focused element inside content', function(this: Context) {
        this.toggleService.open = true;
        this.detectChanges();

        const dummyButton: HTMLElement = document.body.querySelector('.dummy-button');
        dummyButton.focus();

        this.toggleService.open = false;
        this.detectChanges();

        expect(document.activeElement).toBe(this.hostElement.querySelector('.signpost-action'));
      });

      it('should get focus back on trigger if signpost gets closed with ESC key', function(this: Context) {
        this.toggleService.open = true;
        this.detectChanges();
        expect(document.body.querySelector('.signpost-content')).not.toBeNull();

        const event: KeyboardEvent = new KeyboardEvent('keydown', { key: 'Escape' });

        document.dispatchEvent(event);
        this.detectChanges();

        expect(document.body.querySelector('.signpost-content')).toBeNull();
        expect(document.activeElement).toBe(this.hostElement.querySelector('.signpost-action'));
      });
    });

    describe('custom trigger', function() {
      spec(ClrSignpost, TestCustomTriggerSignpost, ClrSignpostModule);

      beforeEach(function(this: Context) {
        this.ifOpenService = this.getClarityProvider(IfOpenService);
      });

      /********
       * This test assumes that if
       */
      it('does not display the default trigger', function(this: Context) {
        const triggerIcon: HTMLElement = this.hostElement.querySelector('clr-icon');

        /**********
         * If there is a clr-icon we are testing that it is not the same shape
         * used for the default trigger.
         */
        if (triggerIcon) {
          expect(triggerIcon.getAttribute('shape')).not.toBe('info');
        }
      });

      it('projects a custom trigger element to hide/show content', function(this: Context) {
        const signpostTrigger: HTMLElement = this.hostElement.querySelector('.signpost-action');
        let signpostContent: HTMLElement;

        expect(signpostTrigger.textContent.trim()).toBe('Custom trigger');

        // Test we have a trigger
        expect(signpostTrigger).not.toBeNull();

        // Test it shows after changes
        signpostTrigger.click();
        this.detectChanges();
        signpostContent = document.body.querySelector('.signpost-content');
        expect(signpostContent).not.toBeNull();
        expect(this.ifOpenService.open).toBe(true);

        // Test it hide when clicked again
        signpostTrigger.click();
        this.detectChanges();
        signpostContent = document.body.querySelector('.signpost-content');
        expect(signpostContent).toBeNull();
        expect(this.ifOpenService.open).toBe(false);
      });
    });
  });
}

@Component({
  template: `
        <button #outsideClick type="button">
            Button to test clicks outside of the dropdown component
        </button>
        <clr-signpost>
            <button
                type="button"
                class="signpost-action btn btn-small btn-link"
                clrSignpostTrigger>
                Custom trigger
            </button>
            <clr-signpost-content *clrIfOpen="openState">
                Signpost content
            </clr-signpost-content>
        </clr-signpost>
    `,
})
class TestCustomTriggerSignpost {
  @ViewChild(ClrSignpost, { static: false })
  signpost: ClrSignpost;
  openState: boolean = false;

  @ViewChild('outsideClick', { read: ElementRef, static: true })
  outsideClickBtn: ElementRef;

  position: string = 'right-middle';
}

@Component({
  template: `tinkywinky!!!
        <button #outsideClick type="button">
            Button to test clicks outside of the dropdown component
        </button>
        <clr-signpost>
            <clr-signpost-content *clrIfOpen="openState">
                <button class="dummy-button" type="button">
                  dummy button
                </button>
                Signpost content
            </clr-signpost-content>
        </clr-signpost>
    `,
})
class TestDefaultSignpost {
  @ViewChild(ClrSignpost, { static: false })
  signpost: ClrSignpost;

  openState: boolean = false;

  @ViewChild('outsideClick', { read: ElementRef, static: true })
  outsideClickBtn: ElementRef;
}
