import Component from '@ember/component';
import { inject as service } from '@ember/service';
import InfiniteScrollMixin from 'ember-cli-infinite-scroll/mixins/infinite-scroll';
import { safeSet } from '../utils/object';

/**
 A component that contains infinite scrolled content.

 @class InfiniteScrollContainerComponent
 @uses InfiniteScrollMixin
 @uses DS.Store
 */

export default Component.extend(InfiniteScrollMixin, {
  classNames: 'infinite-scroll-container',

  /**
   {{#crossLink "DS.Store"}}{{/crossLink}}
   */

  store: service(),

  /**
   Will be passed into the scroll listener to be the observed element on scroll.

   @property scrollContainer
   @type { String }
   @default '.infinite-scroll-container'
   */

  scrollContainer: '.infinite-scroll-container',

  /**
   Starts the infinite query.

   @method didReceiveAttrs
   */

  didReceiveAttrs() {
    this.infiniteQuery();
  },

  /**
   Record processing or anything else that needs to happen with the returned
   records.

   @method afterInfiniteQuery
   @param  newRecords { Object } the records returned in this cycle
   */

  afterInfiniteQuery(newRecords) {
    let content = newRecords && newRecords.get('content');
    if (!content) {
      content = newRecords;
    }
    let infiniteContentPropertyName = this.get('infiniteContentPropertyName');
    let model = this.get(infiniteContentPropertyName);

    if (model) {
      model.addObjects(content);
    } else {
      safeSet(this, infiniteContentPropertyName, newRecords);
    }
  }
});
