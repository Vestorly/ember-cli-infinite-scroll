import Ember from 'ember';

import InfiniteScrollRouteMixin from 'ember-cli-infinite-scroll/mixins/infinite-scroll-route';

const { Route } = Ember;

export default Route.extend(InfiniteScrollRouteMixin, {
  model() {
    return this.infiniteQuery('post', {group_ids: '54c0452c8a5f04ef080001c1'});
  }
});