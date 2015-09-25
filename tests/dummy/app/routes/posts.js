import Ember from 'ember';

import InfiniteScrollRouteMixin from 'ember-cli-infinite-scroll/mixins/infinite-scroll-route';

const { Route } = Ember;

export default Route.extend(InfiniteScrollRouteMixin, {
  model() {
    return this.infiniteQuery('post');
  }
});