import Ember from 'ember';
import InfiniteScroll from 'labs/mixins/infinite-scroll';

const { Mixin, computed } = Ember;

export default Mixin.create(InfiniteScroll, {

  /**
   True if the InfiniteScroll properties will be reset on `willTransition`
   */

  resetInfiniteOnTransition: true,

  infiniteModelName: 'controller.model',

  infiniteQuerying: computed(function(key, value) {
    if ('undefined' !== typeof value) {
      this.set('controller.infiniteQuerying', value);
      return value;
    } else {
      return this.get('controller.infiniteQuerying');
    }
  }),

  _infiniteScrollAvailable: computed('infiniteScrollAvailable', function(key, available) {
    if ('undefined' !== typeof available) {
      this.set('controller.infiniteScrollAvailable', available);
      return this.set('infiniteScrollAvailable', available);
    } else {
      available = this.get('controller.infiniteScrollAvailable');
      if (!available) {
        available = this.get('infiniteScrollAvailable');
        this.set('controller.infiniteScrollAvailable', available);
      }
      return available;
    }
  }),

  actions: {
    didTransition: function () {
      let cycle = this.get('_cycleCount');
      if (cycle < 1) {
        this.send('performInfinite');
      }
    }
  },

  _resetProperties: function() {
    let reset = this.get('resetInfiniteOnTransition'),
        infiniteIncrementProperty = this.get('infiniteIncrementProperty');

    if (reset) {
      this.set(infiniteIncrementProperty, 0);
    }

  }.on('willTransition')
});