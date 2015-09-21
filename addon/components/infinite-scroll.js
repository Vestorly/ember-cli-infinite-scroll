import Ember from 'ember';

const { Component } = Ember;

/**
 A component to trigger infinite scroll.

 @class InfiniteScrollComponent
 */

export default Component.extend({

  /**
   The name of the method to trigger

   @property performInfinite
   @type { String }
   @default 'performInfinite
   */

  performInfinite: 'performInfinite',

  /**
   The distance from the bottom at which the infinite scroll will fire.

   @property triggerDistance
   @type { Number }
   @default 0
   */

  triggerDistance: 0,

  /**
   Whether or not the infinite scroll can be triggered.

   @property infiniteScrollAvailable
   @type { Boolean }
   @default true
   */

  infiniteScrollAvailable: true,

  actions: {

    /**
     Triggers the `performInfinite` method.

     @event performInfinite
     */

    performInfinite() {
      this.sendAction('performInfinite');
    }
  }
});