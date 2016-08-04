import Ember from 'ember';
import { module, test } from 'qunit';
import infiniteScrollMixin from 'ember-cli-infinite-scroll/mixins/infinite-scroll';

const { Component, RSVP } = Ember;
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

module('Unit - InfiniteScrollMixin');

test('#afterInfiniteQuery', function(assert) {
  let infiniteScrollComponent = Component.extend(infiniteScrollMixin);
  let subject = infiniteScrollComponent.create();

  subject.set('model', Ember.A());

  subject.afterInfiniteQuery(newRecords);
  assert.equal(subject.get('model.length'), 2, 'new records were correctly added');
});

test('#_updateInfiniteProperties', function(assert) {
  let infiniteScrollComponent = Component.extend(infiniteScrollMixin);
  let subject = infiniteScrollComponent.create();

  subject._updateInfiniteProperties(12);
  assert.equal(subject.get('_cycleCount'), 1, 'cycleCount was correctly set');
});

test('#_updateInfiniteCount', function(assert) {
  let infiniteScrollComponent = Component.extend(infiniteScrollMixin);
  let subject = infiniteScrollComponent.create();
  subject.set('infiniteIncrementProperty', 'testStart');

  subject._updateInfiniteCount(12);
  assert.equal(subject.get('testStart'), 12, 'infiniteIncrementProperty was correctly incremented');
});

test('#updateHasMoreContent', function(assert) {
  let infiniteScrollComponent = Component.extend(infiniteScrollMixin);
  let subject = infiniteScrollComponent.create();
  subject.set('limit', 10);

  subject.updateHasMoreContent(10);
  let hasMoreContent = subject.get('hasMoreContent');
  assert.ok(hasMoreContent, 'does indeed have more content');

  subject.updateHasMoreContent(7);
  hasMoreContent = subject.get('hasMoreContent');
  assert.ok(!hasMoreContent, 'does not indeed have more content');
});

test('#infiniteQuery', function(assert) {
  let infiniteScrollComponent = Component.extend(infiniteScrollMixin);
  let subject = infiniteScrollComponent.create();

  subject.infiniteDataQuery = function() {
    return promisedRecords;
  };

  subject.set('infiniteQueryParams', ['start', 'limit', 'test']);
  subject.infiniteQuery('post', {test: true});

  let infiniteModelName = subject.get('infiniteModelName');

  assert.equal(subject.get('infiniteModelName'), 'post', 'model name properly set');
  assert.ok(subject.get('test'), 'test param properly set');
});
