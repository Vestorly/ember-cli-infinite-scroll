import Ember from 'ember';
import InfiniteScroll from 'ember-cli-infinite-scroll/mixins/infinite-scroll';

const { Mixin, computed, on } = Ember;

/**
 A mixin for routes that need infinite scrolling.

 @class InfiniteScrollRouteMixin
 */

export default Mixin.create(InfiniteScroll, {

  /**
   Delegates a given property to the related controller (or specified controller
   if `controllerName` is defined. This is useful so that properties are
   available to use on the controller.

   @param property { String } the property to get or set
   @param value the value of the propery to set
   */

  coerceControllerAlias: function(property, value) {
    let controllerName = this.get('controllerName') || this.get('routeName');
    let controller = this.get('controller') || this.controllerFor(controllerName);
    if ('undefined' !== typeof value) {
      controller.set(property, value);
      return value;
    } else {
      return controller.get(property);
    }
  },

  /**
   True if the infinite scroll can be used.

   @property infiniteScrollAvailable
   @type { Boolean }
   */

  infiniteScrollAvailable: computed(function(key, value) {
    return this.coerceControllerAlias('infiniteScrollAvailable', value);
  }),

  /**
   True if it should continue making calls for new content.

   @property hasMoreContent
   @type { Boolean }
   */

  hasMoreContent: computed(function(key, value) {
    return this.coerceControllerAlias('hasMoreContent', value);
  }),

  /**
   True if a query has been started but not finished.

   @property infiniteQuerying
   @type { Boolean }
   */

  infiniteQuerying: computed(function(key, value) {
    return this.coerceControllerAlias('infiniteQuerying', value);
  }),

  /**
   The name of the model that the infinite content will be added to.

   @property infiniteModelName
   @type { String }
   @default 'controller.model'
   */

  infiniteModelName: 'controller.model',

  /**
   Resets the property defined by `infiniteIncrementProperty` on
   `willTransition`.

   @method _resetProperties
   @private
   */

  _resetProperties: on('willTransition', function() {
    let infiniteIncrementProperty = this.get('infiniteIncrementProperty');
    this.set(infiniteIncrementProperty, 0);
  }),

  actions: {

    /**
     Sends `performInfinite`

     @event didTransition
     */

    didTransition: function () {
      let cycle = this.get('cycleCount');
      if (cycle < 1) {
        this.send('performInfinite');
      }
    }
  }
});