import Ember from 'ember';
var computed = Ember.computed;

export default Ember.Component.extend({
  isFetching: false,
  beginInfinite: true,
  hasMoreContent: true,
  beginLength: 0,
  endLength: 1,
  limit: 12,

  classNames: ["infinite-scroller"],

  hidden: computed.none('hasMoreContent', 'isFetching'),

  triggerDistance: 500,
  visibleContent: computed.oneWay('contextController.content'),
  content: computed.oneWay('contextController.content'),
  modelName: computed.readOnly('content.firstObject.constructor.typeKey'),

  fetchMore: function() {
    if (this.get('isFetching')) {return;}

    this.set('isFetching', true);
    var beforeLength = this.get('content.length'),
        query = (this.get('query') || {model: this.get('modelName'), params: {}}),
        self = this;
    query.params.start = this.get('visibleContent.length');
    query.params.limit = this.get('limit');

    this.get('contextController.store').find(query.model, query.params).then(function (stuff) {
      var returnedContentLength = stuff.get('length');
      self.set('isFetching', false);
      if(query.callback){
        query.callback(stuff);
      } else {
        self.get('content').addObjects(stuff);
      }
      Ember.run.next(self, function() {
        if(self.get('content.length') === beforeLength || returnedContentLength < query.params.limit) {
          self.set('hasMoreContent', false);
        }
      });
    });
  },

  actions: {
    getMoreContent: function() {
      Ember.run.debounce(this, function() {
        this.fetchMore();
      }, 200);
    }
  }
});