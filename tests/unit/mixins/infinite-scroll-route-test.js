import Controller from '@ember/controller';
import Route from '@ember/routing/route';
import { module, test } from 'qunit';
import infiniteScrollRouteMixin from 'ember-cli-infinite-scroll/mixins/infinite-scroll-route';

module('Unit - InfiniteScrollRouteMixin');

test('#infiniteScrollAvailable', function(assert) {
  let infiniteScrollRoute = Route.extend(infiniteScrollRouteMixin);
  let controller = Controller.create();
  let subject = infiniteScrollRoute.create();

  subject.set('controller', controller);

  subject.set('infiniteScrollAvailable', true);
  assert.ok(controller.get('infiniteScrollAvailable'), 'controller property was set correctly');
  assert.ok(subject.get('infiniteScrollAvailable'), 'route property properly computes');
});

test('#hasMoreContent', function(assert) {
  let infiniteScrollRoute = Route.extend(infiniteScrollRouteMixin);
  let controller = Controller.create();
  let subject = infiniteScrollRoute.create();

  subject.set('controller', controller);

  subject.set('hasMoreContent', true);
  assert.ok(controller.get('hasMoreContent'), 'controller property was set correctly');
  assert.ok(subject.get('hasMoreContent'), 'route property properly computes');
});

test('#infiniteQuerying', function(assert) {
  let infiniteScrollRoute = Route.extend(infiniteScrollRouteMixin);
  let controller = Controller.create();
  let subject = infiniteScrollRoute.create();

  subject.set('controller', controller);

  subject.set('infiniteQuerying', true);
  assert.ok(controller.get('infiniteQuerying'), 'controller property was set correctly');
  assert.ok(subject.get('infiniteQuerying'), 'route property properly computes');
});

test('#_resetProperties', function(assert) {
  let infiniteScrollRoute = Route.extend(infiniteScrollRouteMixin);
  let controller = Controller.create();
  let subject = infiniteScrollRoute.create({infiniteIncrementProperty: 'testProperty'});

  subject.set('controller', controller);

  subject.set('testProperty', 1);
  assert.ok(subject.get('testProperty'), 'route property properly set');

  subject._resetProperties();
  assert.ok(!subject.get('testProperty'), 'route property properly set');
});
