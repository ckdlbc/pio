import Vue, { VNode } from 'vue';
import { Cache } from '../../src/core/cache';
import { trackEvent } from '../../src/index';
declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
  interface Window {
    pio: Cache;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $trackEvent: any;
  }
}
