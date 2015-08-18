import Ember from 'ember';

const { Mixin, run, computed } = Ember;
const { alias } = computed;

/**
 A mixin for infinite scrolls.

 @class InfiniteScrollMixin
 */

export default Mixin.create({

  /**
   True if a request has been initiated but not resolved.

   @property infiniteQuerying
   @default false
   */

  infiniteQuerying: false,

  /**
   The number of queries that have cycled.

   @property _cycleCount
   @type { Number }
   @default 0
   @private
   */

  _cycleCount: 0,

  /**
   True if the query can be sent.

   @property infiniteScrollAvailable
   @default true
   */

  infiniteScrollAvailable: true,

  /**
   An alias for infiniteScrollAvailable, to be overridden in the route.

   @property _infiniteScrollAvailable
   */

  _infiniteScrollAvailable: alias('infiniteScrollAvailable'),

  /**
   The start param.

   @property start
   @type { Number }
   @default 0
   */

  start: 0,

  /**
   The limit param.

   @property limit
   @type { Number }
   @default 12
   */

  limit: 12,

  /**
   The property that will be incremented after each cycle.

   @property infiniteIncrementProperty
   @type { String }
   @default 'start'
   */

  infiniteIncrementProperty: 'start',

  /**
   The property that will increment `infiniteIncrementProperty`.

   @property infiniteIncrementBy
   @type { String }
   @default 'limit'
   */

  infiniteIncrementBy: 'limit',

  /**
   The name of the model that the `infiniteScroll` records will be added to.

   @property infiniteModelName
   @type { String }
   @default 'model'
   */

  infiniteModelName: 'model',

  /**
   The model type that will be queried.

   @property infiniteModelType
   @type { String }
   @default ''
   */

  infiniteModelType: '',

  /**
   An array of params that are needed for the infinite query.

   @property infiniteQueryParams
   @type { Array }
   @default ['start', 'limit']
   */

  infiniteQueryParams: ['start', 'limit'],

  /**
   Does what's needed for the infinite scroll.
   - sets `infiniteQuerying` to `true`
   - calls `beforeInfiniteQuery`
   - calls `infiniteQuery`
   then:
   - calls `afterInfiniteQuery`
   - calls `_updateInfiniteProperties`
   - sets ` infiniteQuerying` to `false`

   @method performInfinite
   @returns { Promise } the records
   */

      performInfinite() {
    if (this.get('infiniteQuerying')) {return;}
    this.set('infiniteQuerying', true);

    let infiniteQueryParams = this.get('infiniteQueryParams');
    let params = this.getProperties(infiniteQueryParams);

    this.beforeInfiniteQuery(params);
    let newRecords = this.infiniteQuery(params);
    newRecords.then( records => {
      let returnedContentLength = records.get('length');

      this.afterInfiniteQuery(records);
      this._updateInfiniteProperties(returnedContentLength);
      this.set('infiniteQuerying', false);
    });

    return newRecords;
  },

  /**
   Called immediately before the infinite query starts.

   @method beforeInfiniteQuery
   @param params { Object } the params that will be used in the query
   */

  beforeInfiniteQuery: Ember.K,

  /**
   The query that will be used.

   @method infiniteQuery
   @param params { Object } the params that will be used in the query
   @return { Promise } the records
   */

      infiniteQuery(params) {
    let modelType = this.get('infiniteModelType');

    return this.store.find(modelType, params);
  },

  /**
   Record processing or anything else that needs to happen with the returned
   records.

   @method afterInfiniteQuery
   @param  newRecords { Object } the records returned in this cycle
   */

      afterInfiniteQuery(newRecords) {
    let modelName = this.get('infiniteModelName');

    this.get(modelName).addObjects(newRecords);
  },

  /**
   Calls `updateInfiniteCount` and `updateInfiniteAvailable`.

   @method _updateScrollProperties
   @param addedLength { Number } the incremental length of the model
   @private
   */

      _updateInfiniteProperties(addedLength) {
    this.updateInfiniteCount(addedLength);
    this.updateInfiniteAvailable(addedLength);
    this.incrementProperty('_cycleCount');
  },

  /**
   Increments a property after the infinite scroll is finished.

   @method updateInfiniteCount
   @param addedLength { Number } the incremental length of the model
   */

      updateInfiniteCount(addedLength) {
    let incrementProperty = this.get('infiniteIncrementProperty');

    this.incrementProperty(incrementProperty, addedLength);
  },

  /**
   Determines whether the infinite scroll should continue after it finishes.

   @method incrementProperties
   @param addedLength { Number } the incremental length of the model
   */

      updateInfiniteAvailable(addedLength) {
    let infiniteIncrementProperty = this.get('infiniteIncrementProperty');
    let shouldIncrement = this.get(infiniteIncrementProperty);
    let hasMoreContent = shouldIncrement >= addedLength;
    this.set('_infiniteScrollAvailable', hasMoreContent);
  },

  actions: {

    /**
     Debounces `_performInfinite`

     @event performInfinite
     */

        performInfinite() {
      run.debounce(this, this.performInfinite, 200);
    }
  }
});