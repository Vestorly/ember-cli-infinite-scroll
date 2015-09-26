import Ember from 'ember';
import InfiniteScrollMixin from 'ember-cli-infinite-scroll/mixins/infinite-scroll';

const { Component } = Ember;

/**
 A component that contains infinite scrolled content.

 @class InfiniteScrollContainerComponent
 @uses InfiniteScrollMixin
 */

export default Component.extend(InfiniteScrollMixin, {
  classNames: 'infinite-scroll-container',

  /**
   Will be passed into the scroll listener to be the observed element on scroll.

   @property scrollContainer
   @type { String }
   @default '.infinite-scroll-container'
   */

  scrollContainer: '.infinite-scroll-container',

  /**
   Gives the component access to the store and starts the infinite query.

   @method didInsertElement
   */

  didInsertElement() {
    let store = this.container.lookup('store:main');
    this.set('store', store);
    this.infiniteQuery();
  },

  /**
   Record processing or anything else that needs to happen with the returned
   records.

   @method afterInfiniteQuery
   @param  newRecords { Object } the records returned in this cycle
   */

  afterInfiniteQuery(newRecords) {
    let infiniteContentPropertyName = this.get('infiniteContentPropertyName');
    let model = this.get(infiniteContentPropertyName);

    if (model) {
      model.addObjects(newRecords.get('content'));
    } else {
      this.set(infiniteContentPropertyName, newRecords);
    }
  }
});