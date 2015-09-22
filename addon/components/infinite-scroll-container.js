import Ember from 'ember';
import InfiniteScrollMixin from 'ember-cli-infinite-scroll/mixins/infinite-scroll';

const { Component } = Ember;

export default Component.extend(InfiniteScrollMixin, {
  classNames: 'infinite-scroll-container',

  scrollContainer: '.infinite-scroll-container',

  modelName: 'model',

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
    let modelName = this.get('infiniteModelName');
    let model = this.get(modelName);

    if (model) {
      model.addObjects(newRecords);
    } else {
      this.set(modelName, newRecords);
    }
  }
});