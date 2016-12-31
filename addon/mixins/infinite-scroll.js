import Ember from 'ember';

const { Mixin, run, computed, RSVP: { resolve } } = Ember;

/**
 A mixin for infinite scrolls.

 @class EmberCliInfiniteScroll.Mixin.InfiniteScroll
 @extends Ember.Mixin
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
   True if there is more content on the server.

   @property hasMoreContent
   @type { Boolean }
   @default true
   */

  hasMoreContent: true,

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
   The name of the property that the `infiniteScroll` records will be added to.

   @property infiniteContentPropertyName
   @type { String }
   @default 'model'
   */

  infiniteContentPropertyName: 'model',

  /**
   The model name that will be queried.

   @property infiniteModelType
   @type { String }
   @default ''
   */

  infiniteModelName: '',

  /**
   The default parameters.

   @property _fullQueryParams
   @default ['start', 'limit']
   @private
   */

  _fullQueryParams: computed('infiniteIncrementBy', 'infiniteIncrementProperty', 'infiniteQueryParams', function() {
    let defaultQueryParams = [this.get('infiniteIncrementBy'), this.get('infiniteIncrementProperty')];
    let infiniteQueryParams = this.get('infiniteQueryParams');
    return defaultQueryParams.concat(infiniteQueryParams);
  }),

  /**
   An array of params that are needed for the infinite query.

   @property infiniteQueryParams
   @type { Array }
   @default []
   */

  infiniteQueryParams: [],

  /**
   Does what's needed for the infinite scroll.
   - sets `infiniteQuerying` to `true`
   - if passed `modelName`, sets `infiniteModelName`
   - if passed `params`, sets `infiniteQueryParams`
   - calls `beforeInfiniteQuery`
   - calls `infiniteQuery`
   then:
   - calls `afterInfiniteQuery`
   - calls `_updateInfiniteProperties`
   - sets ` infiniteQuerying` to `false`

   @method performInfinite
   @param modelName { String } the model to be queried
   @param params { Object } params to use in the query
   @returns { Promise } the records
   */

  infiniteQuery(modelName, params) {
    if (this.get('infiniteQuerying') || !this.get('infiniteScrollAvailable')) {
      return resolve([]);
    }
    this.set('infiniteQuerying', true);

    if(modelName) {
      this.set('infiniteModelName', modelName);
    }

    if(params) {
      let paramsToSet = Object.keys(params);
      this.set('infiniteQueryParams', paramsToSet);
      this.setProperties(params);
    }

    let infiniteModelName = this.get('infiniteModelName');
    let fullQueryParams = this.get('_fullQueryParams');

    params = this.getProperties(fullQueryParams);

    this.beforeInfiniteQuery(params);
    let newRecords = this.infiniteDataQuery(infiniteModelName, params)
    .then(records => {
      let returnedContentLength = records.get('length');
      let recordsArray = records.toArray();

      this.afterInfiniteQuery(recordsArray);
      this._updateInfiniteProperties(returnedContentLength);
      this.set('infiniteQuerying', false);

      return recordsArray;
    });

    return newRecords;
  },

  /**
   Called immediately before the infinite query starts.

   @method beforeInfiniteQuery
   @param params { Object } the params that will be used in the query
   */

  beforeInfiniteQuery() {},

  /**
   The query that will be used.

   @method infiniteQuery
   @param modelName { String } the name of the model
   @param params { Object } the params that will be used in the query
   @return { Promise } the records
   */

  infiniteDataQuery(modelName, params={}) {
    return this.get('store').query(modelName, params);
  },

  /**
   Record processing or anything else that needs to happen with the returned
   records.

   @method afterInfiniteQuery
   @param  newRecords { Object } the records returned in this cycle
   */

  afterInfiniteQuery(newRecords) {
    let contentPropertyName = this.get('infiniteContentPropertyName');
    let model = this.get(contentPropertyName);

    if (model) {
      model.addObjects(newRecords);
    }
  },

  /**
   Calls `_updateInfiniteCount` and `updateInfiniteAvailable`.

   @method _updateScrollProperties
   @param addedLength { Number } the incremental length of the model
   @private
   */

  _updateInfiniteProperties(addedLength) {
    this._updateInfiniteCount(addedLength);
    this.updateHasMoreContent(addedLength);
    this.incrementProperty('_cycleCount');
  },

  /**
   Increments a property after the infinite scroll is finished.

   @method _updateInfiniteCount
   @param addedLength { Number } the incremental length of the model
   @private
   */

  _updateInfiniteCount(addedLength) {
    let incrementProperty = this.get('infiniteIncrementProperty');

    this.incrementProperty(incrementProperty, addedLength);
  },

  /**
   Determines whether the infinite scroll should continue after it finishes.

   @method updateHasMoreContent
   @param addedLength { Number } the incremental length of the model
   */

  updateHasMoreContent(addedLength) {
    let infiniteIncrementBy = this.get('infiniteIncrementBy');
    let shouldIncrement = this.get(infiniteIncrementBy);
    let hasMoreContent = addedLength >= shouldIncrement;
    this.set('hasMoreContent', hasMoreContent);
    this.set('infiniteScrollAvailable', hasMoreContent);
  },

  /**
   Resets
   {{#crossLink "EmberCliInfiniteScroll.Mixin.InfiniteScroll/hasMoreContent:property"}}{{/crossLink}} and
   {{#crossLink "EmberCliInfiniteScroll.Mixin.InfiniteScroll/infiniteScrollAvailable:property"}}{{/crossLink}},
   and the values for
   {{#crossLink "EmberCliInfiniteScroll.Mixin.InfiniteScroll/infiniteIncrementProperty:property"}}{{/crossLink}} and
   {{#crossLink "EmberCliInfiniteScroll.Mixin.InfiniteScroll/infiniteContentPropertyName:property"}}{{/crossLink}}

   @method resetInfinite
   */

  resetInfinite() {
    let {
      infiniteIncrementProperty,
      infiniteContentPropertyName
    } = this.getProperties('infiniteContentPropertyName', 'infiniteIncrementProperty');

    this.get(infiniteContentPropertyName).clear();

    this.set(infiniteIncrementProperty, 0);
    this.set('hasMoreContent', true);
    this.set('infiniteScrollAvailable', true);
  },

  actions: {

    /**
     Debounces `_performInfinite`

     @event performInfinite
     */

    performInfinite() {
      run.once(this, this.infiniteQuery);
    }
  }
});
