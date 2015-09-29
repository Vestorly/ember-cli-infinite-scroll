# ember-cli-infinite-scroll [![Master Build Status](https://circleci.com/gh/Vestorly/ember-cli-infinite-scroll.png?style=shield)](https://circleci.com/gh/Vestorly/ember-cli-infinite-scroll/tree/master) 
Demo at [http://vestorly.github.io/ember-cli-infinite-scroll](http://vestorly.github.io/ember-cli-infinite-scroll)

Most Ember data adapters perform data fetches in a single query. This can be problematic for data transfer and rendering. If a user never views the content, it can also put unnecessary strain on an app.   

**ember-cli-infinite-scroll** is an ember-cli addon that can be used as a mixin or a component. By default it issues ember data queries using 'start' and 'limit', incrementing each time a query is made. 

Advanced features include dynamically calculating query params, pre- and post-query processing methods, and state properties in components and controllers for display of loading spinners and end-of-content messages. 

### Installation
---

* Install addon `ember install ember-cli-infinite-scroll`

### As a component
---

Use `infinite-scroll-container` as a self-contained component. Specify the name of the model that will be queried as `infiniteModelName`.

```handlebars
{{infinite-scroll-container infiniteModelName='post'}}
```

### As a controller/component mixin
---

Use `mixins/infinite-scroll` in a controller or component.

```javascript
import Ember from 'ember';
import InfiniteScrollMixin from 'ember-cli-infinite-scroll/mixins/infinite-scroll';

export default Ember.Controller.extend(InfiniteScrollMixin, {
  startContentQuery() {
    this.infiniteQuery('post');
  }
});
```

In the template, use the `infinite-scroll` component at the bottom of the 
infinite content.

```handlebars
{{#each model as |post|}}
  {{post.title}}
{{/each}}
{{infinite-scroll}}
```

### As a route mixin
---

Use `mixins/infinite-scroll-route` in a route.

```javascript
import Ember from 'ember';
import InfiniteScrollRouteMixin from 'ember-cli-infinite-scroll/mixins/infinite-scroll-route';

export default Ember.Route.extend(InfiniteScrollRouteMixin, {
  model() {
    return this.infiniteQuery('post', { popular: true });
  }
});
```

In the template, use the `infinite-scroll` component at the bottom of the infinite content.

```handlebars
{{#each model as |post|}}
  {{post.title}}
{{/each}}
{{infinite-scroll}}
```

Controllers (and in the future, routable components), have access to `infiniteScrollAvailable`, `hasMoreContent`, and `infiniteQuerying`, which can be used in templates.

### Properties
---

| Property | Default | Description |
|----------|-------------|---------|
| `infiniteQuerying` | `false` | True when a query is in progress. |
| `infiniteScrollAvailable` | `true` | True if the infinite query can be triggered |
| `hasMoreContent` | `true` | True if it expects to find more content with another query |
| `infiniteIncrementProperty` | `'start'` | The name of the property that will be incremented with each query |
| `infiniteIncrementBy` | `'limit'` | The name of the property that will increment `infiniteIncrementProperty` |
| `infiniteContentPropertyName` | `'model'` | The name of the property that the records will be added to. |
| `infiniteModelName` | `''` | The name of the model that will be queried |
| `infiniteQueryParams` | `[]` | Name of params that will be sent with each query, in addition to `infiniteIncrementProperty` and `infiniteIncrementBy` |

### Methods 
---

| Method | Params | Description |
|--------|--------|-------------|
| `infiniteQuery` | `modelName`, `params` | Calls `beforeInfiniteQuery`, `infiniteQuery` and `afterInfiniteQuery`. If passed `modelName`, sets `infiniteModelName`. If passed `params`, sets `infiniteQueryParams`. |
| `beforeInfiniteQuery` | `params` | Called before the query. `params` are the params to be used in the query |
| `infiniteDataQuery` | `modelName`, `params` | Performs the query with a model name and params |
| `afterInfiniteQuery` | `newRecords` | Adds the new records to the current collection |
| `updateHasMoreContent` | `addedLength` | If `addedLength` is 0, sets `hasMoreContent` to `false` |

### Examples
---

**Dynamic Query Params**

```javascript
infiniteModelName: 'post',

infiniteQueryParams: ['recent'],

limit: Ember.computed('isMobile', function() {
  if(this.get('isMobile')) {
    return 4;
  }
   
  return 10;
})

actions: {
  toggleRecent: function() {
    this.toggleProperty('recent');
  }
}
```


**Process Records After Query**

```javascript
afterInfiniteQuery(newRecords) {
newRecords.setEach('popular', true);
return this._super(newRecords); // adds records to the model
}
```


**Turn Off Infinite Scroll Every 100 Records** 

```javascript
afterInfiniteQuery(newRecords) {
  let currentCount = this.get('currentCount') + newRecords.get('length');
  
  if(currentCount > 100) {
    this.set('infiniteScrollAvailable', false);
    this.set('currentCount', 0);
  } else {
    set('currentCount', currentCount);
  } 
  
  return this._super.apply(this, arguments);
},

actions: {
  turnOnInfiniteScroll: {
    this.set('infiniteScrollAvailable', true);
  }
}
```

Template:
```handlebars
{{#unless infiniteScrollAvailable}}
  <button {{action 'turnOnInfiniteScroll'}}>Show More</button>
{{/unless}}
```

**Add an End-of-Content Message**

```handlebars
{{#unless hasMoreContent}}
  You're at the end of the line.
{{/unless}}
```

###Other Resources
---

[Ember Infinity](http://hhff.github.io/ember-infinity/) is a great addon that works with the Rails Kaminari Gem.