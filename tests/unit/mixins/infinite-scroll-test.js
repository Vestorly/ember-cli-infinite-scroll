import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import infiniteScrollMixin from 'ember-cli-infinite-scroll/mixins/infinite-scroll';
import hbs from 'htmlbars-inline-precompile';

const { Component, RSVP, getOwner } = Ember;
const { Promise } = RSVP;

const newRecords = Ember.A([{
  title: 'All you need to know',
  text: "You'll never need to read anything else"
}, {
  title: 'Oh and one more thing',
  text: 'Read this too'
}]);

const promisedRecords = new Promise(function(resolve){
  return resolve(newRecords);
});

moduleForComponent('Unit - InfiniteScrollMixin', {
  integration: true,
  beforeEach() {
    let self = this;
    let InfiniteScrollComponent = Component.extend(infiniteScrollMixin, {
      init() {
        this._super(...arguments);
        self.componentInstance = this;
      }
    });
    this.register('component:infinite-scroll', InfiniteScrollComponent);
    this.render(hbs`{{infinite-scroll}}`);
  }
});

test('#afterInfiniteQuery', function(assert) {
  let subject = this.componentInstance;

  subject.set('model', Ember.A());

  subject.afterInfiniteQuery(newRecords);
  assert.equal(subject.get('model.length'), 2, 'new records were correctly added');
});

test('#_updateInfiniteProperties', function(assert) {
  let subject = this.componentInstance;

  subject._updateInfiniteProperties(12);
  assert.equal(subject.get('_cycleCount'), 1, 'cycleCount was correctly set');
});

test('#_updateInfiniteCount', function(assert) {
  let subject = this.componentInstance;
  subject.set('infiniteIncrementProperty', 'testStart');

  subject._updateInfiniteCount(12);
  assert.equal(subject.get('testStart'), 12, 'infiniteIncrementProperty was correctly incremented');
});

test('#updateHasMoreContent', function(assert) {
  let subject = this.componentInstance;
  subject.set('limit', 10);

  subject.updateHasMoreContent(10);
  let hasMoreContent = subject.get('hasMoreContent');
  assert.ok(hasMoreContent, 'does indeed have more content');

  subject.updateHasMoreContent(7);
  hasMoreContent = subject.get('hasMoreContent');
  assert.ok(!hasMoreContent, 'does not indeed have more content');
});

test('#infiniteQuery', function(assert) {
  let subject = this.componentInstance;

  subject.infiniteDataQuery = function() {
    return promisedRecords;
  };

  subject.set('infiniteQueryParams', ['start', 'limit', 'test']);
  subject.infiniteQuery('post', {test: true});

  assert.equal(subject.get('infiniteModelName'), 'post', 'model name properly set');
  assert.ok(subject.get('test'), 'test param properly set');
});
