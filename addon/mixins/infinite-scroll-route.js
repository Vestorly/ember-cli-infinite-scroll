import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { on } from '@ember/object/evented';
import InfiniteScrollMixin from 'ember-cli-infinite-scroll/mixins/infinite-scroll';

/**
 Delegates a given property to the related controller (or specified controller
 if `controllerName` is defined. This is useful so that properties are
 available to use on the controller.
 */

function coerceControllerAlias(property) {
  return computed(property, {
    get() {
      let controllerName = this.get('controllerName') || this.get('routeName');
      let controller = this.get('controller') || this.controllerFor(controllerName);
      return controller.get(property);
    },
    set(key, value) {
      let controllerName = this.get('controllerName') || this.get('routeName');
      let controller = this.get('controller') || this.controllerFor(controllerName);
      controller.set(property, value);
      return value;
    }
  });
}

/**
 A mixin for routes that need infinite scrolling.

 @class InfiniteScrollRouteMixin
 @uses InfiniteScrollMixin
 */

export default Mixin.create(InfiniteScrollMixin, {

  /**
   Sets defaults for `infiniteScrollAvailable`, `hasMoreContent`, and the
   `infiniteIncrementProperty`

   @method beforeModel
   */

  beforeModel: function() {
    let start = this.get('infiniteIncrementProperty');
    this.set(start, 0);
    this.set('infiniteScrollAvailable', true);
    this.set('hasMoreContent', true);
  },

  /**
   True if the infinite scroll can be used.

   @property infiniteScrollAvailable
   @type { Boolean }
   */

  infiniteScrollAvailable: coerceControllerAlias('infiniteScrollAvailable'),

  /**
   True if it should continue making calls for new content.

   @property hasMoreContent
   @type { Boolean }
   */

  hasMoreContent: coerceControllerAlias('hasMoreContent'),

  /**
   True if a query has been started but not finished.

   @property infiniteQuerying
   @type { Boolean }
   */

  infiniteQuerying: coerceControllerAlias('infiniteQuerying'),

  /**
   The name of the model that the infinite content will be added to.

   @property infiniteContentPropertyName
   @type { String }
   @default 'controller.model'
   */

  infiniteContentPropertyName: 'controller.model',

  /**
   Resets the property defined by `infiniteIncrementProperty` on
   `willTransition`.

   @method _resetProperties
   @private
   */

  _resetProperties: on('willTransition', function() {
    let infiniteIncrementProperty = this.get('infiniteIncrementProperty');
    this.set(infiniteIncrementProperty, 0);
  })
});
