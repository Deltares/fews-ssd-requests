/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import { Components } from '@deltares/fews-ssd-webcomponent';




export declare interface SchematicStatusDisplay extends Components.SchematicStatusDisplay {}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['height', 'src', 'width']
})
@Component({
  selector: 'schematic-status-display',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['height', 'src', 'width']
})
export class SchematicStatusDisplay {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}
