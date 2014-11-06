import Ember from 'ember';
var computed = Ember.computed;

var InfiniteScroller = Ember.Component.extend({
  isFetching: false,
  beginInfinite: true,
  hasMoreContent: true,
  beginLength: 0,
  endLength: 1,
  limit: 12,

  classNames: ["infinite-scroller"],

  hidden: computed.none('hasMoreContent', 'isFetching'),

  listenerDistance: 500,
  visibleContent: computed.defaultTo('contextController.content'),
  content: computed.defaultTo('contextController.content'),
  modelName: computed.defaultTo('content.firstObject.constructor.typeKey'),
  offsetFromTop: null,
  documentHeight: 0,

  listenForOffset: (function(){
    this.set('hasMoreContent', true);
  }).observes('offsetFromTop'),

  listenForDistance: function() {
    var self = this;
    if (this.get('beginInfinite')) {
      Ember.$(window).on('scroll.infinite-scroll', function () {
        Ember.run(function () {
          var offsetFromTop = self.$().offset().top;
          var documentHeight = Ember.$(document).height();
          var isDistanceFromBottom = ( offsetFromTop - $(window).scrollTop() - Ember.$(window).height() <= self.get('listenerDistance') );
          self.setProperties({
            isDistanceFromBottom: isDistanceFromBottom,
            offsetFromTop: offsetFromTop,
            documentHeight: documentHeight
          });
        });
      });
    }
  }.observes('beginInfinite', 'listenerDistance').on('init'),

  infiniteScroll: function() {
    if (this.get('isDistanceFromBottom') && this.get('beginInfinite') && this.get('hasMoreContent')) {
      Ember.run.debounce(this, function() {
        this.fetchMore();
      }, 200);
    }
  }.observes('isDistanceFromBottom', 'documentHeight'),

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

  willDestroyElement: function() {
    Ember.$(window).off('scroll.infinite-scroll');
  }

});

export default InfiniteScroller;